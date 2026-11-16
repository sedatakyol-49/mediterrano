<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/bootstrap.php';

// Read credentials from stdin, never from command-line arguments or a web route.
$data = json_decode(stream_get_contents(STDIN), true, 8, JSON_THROW_ON_ERROR);
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password) || strlen($password) < 12 || strlen($password) > 72) {
    fwrite(STDERR, "Use a valid email and a password between 12 and 72 bytes.\n");
    exit(1);
}
$db = database();
$hash = password_hash($password, PASSWORD_DEFAULT);
$query = $db->prepare('SELECT id FROM cms_users WHERE email = ?');
$query->execute([$email]);
$id = $query->fetchColumn();
if ($id !== false) {
    $db->prepare('UPDATE cms_users SET password_hash = ? WHERE id = ?')->execute([$hash, $id]);
} else {
    $id = (int) $db->query('SELECT COALESCE(MAX(id), 0) + 1 FROM cms_users')->fetchColumn();
    $db->prepare('INSERT INTO cms_users (id, email, password_hash) VALUES (?, ?, ?)')->execute([$id, $email, $hash]);
}
echo "Administrator saved.\n";
