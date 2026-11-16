<?php
declare(strict_types=1);

// Local PHP development server only. IONOS uses public/.htaccess.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/api/index.php') { require dirname(__DIR__) . '/public/api/index.php'; return true; }
if ($path === '/contact.php') { require dirname(__DIR__) . '/public/contact.php'; return true; }
require __DIR__ . '/bootstrap.php';
$root = realpath(config()['public_dir']);
$file = realpath($root . '/' . rawurldecode($path));
if ($file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && preg_match('/\.(jpe?g|png|webp|gif)$/i', $file)) {
    header('X-Content-Type-Options: nosniff');
    header('Content-Type: ' . (new finfo(FILEINFO_MIME_TYPE))->file($file));
    readfile($file);
    return true;
}
http_response_code(404);
echo 'Not found';
