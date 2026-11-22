<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Nur POST ist erlaubt.']);
    exit;
}

$rawInput = file_get_contents('php://input', false, null, 0, 20001);
if ($rawInput === false || strlen($rawInput) > 20000) { http_response_code(413); echo json_encode(['success' => false, 'message' => 'Nachricht zu lang.']); exit; }
$data = json_decode($rawInput ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültige Anfrage.']);
    exit;
}

foreach (['name', 'email', 'message'] as $field) {
    if (!is_string($data[$field] ?? null)) { http_response_code(422); echo json_encode(['success' => false, 'message' => 'Ungültige Eingabe.']); exit; }
}
$name = trim($data['name']);
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Bitte alle Felder ausfüllen.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Bitte eine gültige E-Mail-Adresse eingeben.']);
    exit;
}

require dirname(__DIR__) . '/backend/bootstrap.php';
try {
    $smtp = config()['smtp'];
    rateLimit('contact:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 5, 600);
} catch (Throwable $exception) {
    http_response_code(503);
    echo json_encode(['success' => false, 'message' => 'Kontaktformular momentan nicht verfügbar. Bitte kontaktieren Sie uns telefonisch.']);
    exit;
}
require_once dirname(__DIR__) . '/backend/mail.php';
$smtpHost = $smtp['host'];
$smtpPort = (int) $smtp['port'];
$smtpUser = $smtp['user'];
$smtpPass = $smtp['password'];
$fromEmail = $smtp['from'];
$toEmail = $smtp['to'];
$subject = 'Neue Kontaktanfrage von der Website';

$safeName = preg_replace('/[\r\n]+/', ' ', $name) ?: $name;
$safeEmail = preg_replace('/[\r\n]+/', ' ', $email) ?: $email;

$body = "Neue Nachricht von mediterrano-em.de\r\n\r\n"
    . "Name: {$safeName}\r\n"
    . "E-Mail: {$safeEmail}\r\n\r\n"
    . "Nachricht:\r\n{$message}\r\n";

try {
    sendSmtpMail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $toEmail, $subject, $body, $safeName, $safeEmail);
    echo json_encode(['success' => true]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'E-Mail konnte nicht gesendet werden.']);
}
