<?php
declare(strict_types=1);

function config(): array
{
    static $config;
    if ($config === null) {
        $path = getenv('MEDITERRANO_CONFIG') ?: __DIR__ . '/config.local.php';
        if (!is_file($path)) {
            throw new RuntimeException('Server configuration is missing.');
        }
        $config = require $path;
    }
    return $config;
}

function database(): PDO
{
    static $database;
    if ($database === null) {
        $config = config();
        $database = new PDO($config['dsn'], $config['db_user'] ?? '', $config['db_password'] ?? '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        if ($database->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
            $database->exec('PRAGMA busy_timeout = 5000');
        }
    }
    return $database;
}

function respond(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function input(): array
{
    $raw = file_get_contents('php://input', false, null, 0, 2_000_001);
    if ($raw === false || strlen($raw) > 2_000_000) {
        respond(['message' => 'Die Anfrage ist zu groß.'], 413);
    }
    try {
        $data = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        respond(['message' => 'Ungültige JSON-Daten.'], 400);
    }
    if (!is_array($data)) {
        respond(['message' => 'Ungültige Anfrage.'], 400);
    }
    return $data;
}

function startAdminSession(): void
{
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('mediterrano_admin');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => config()['secure_cookies'] ?? true,
        'samesite' => 'Strict',
        'path' => '/api',
    ]);
    session_start();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    if (isset($_SESSION['user']) && time() - ($_SESSION['last_seen'] ?? 0) > 3600) {
        unset($_SESSION['user']);
    }
    if (isset($_SESSION['user'])) {
        $_SESSION['last_seen'] = time();
    }
}

function requireAdmin(): void
{
    if (!isset($_SESSION['user'])) {
        respond(['message' => 'Bitte erneut anmelden.'], 401);
    }
}

function requireCsrf(): void
{
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token)) {
        respond(['message' => 'Die Sitzung ist ungültig. Bitte neu laden.'], 403);
    }
}

function rateLimit(string $key, int $maximum, int $window): void
{
    $db = database();
    $bucket = hash('sha256', $key);
    $now = time();
    $expires = $now + $window;
    $db->prepare('DELETE FROM cms_rate_limits WHERE expires_at < ?')->execute([$now]);
    if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $sql = 'INSERT INTO cms_rate_limits (bucket, attempts, expires_at) VALUES (?, 1, ?)
                ON CONFLICT(bucket) DO UPDATE SET attempts = attempts + 1';
    } else {
        $sql = 'INSERT INTO cms_rate_limits (bucket, attempts, expires_at) VALUES (?, 1, ?)
                ON DUPLICATE KEY UPDATE attempts = attempts + 1';
    }
    $db->prepare($sql)->execute([$bucket, $expires]);
    $query = $db->prepare('SELECT attempts FROM cms_rate_limits WHERE bucket = ?');
    $query->execute([$bucket]);
    if ((int) $query->fetchColumn() > $maximum) {
        header('Retry-After: ' . $window);
        respond(['message' => 'Zu viele Versuche. Bitte später erneut versuchen.'], 429);
    }
}

function document(string $scope): array
{
    $query = database()->prepare('SELECT revision, payload FROM cms_documents WHERE scope = ?');
    $query->execute([$scope]);
    $row = $query->fetch();
    if (!$row) {
        throw new RuntimeException('Run the installation command first.');
    }
    return ['revision' => (int) $row['revision'], 'content' => json_decode($row['payload'], true, 64, JSON_THROW_ON_ERROR)];
}

function saveDocument(string $scope, array $content, int $expectedRevision): int
{
    $query = database()->prepare('UPDATE cms_documents SET payload = ?, revision = revision + 1, updated_at = ? WHERE scope = ? AND revision = ?');
    $query->execute([json_encode($content, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), gmdate('c'), $scope, $expectedRevision]);
    if ($query->rowCount() !== 1) {
        respond(['message' => 'Inzwischen wurden Änderungen gespeichert. Bitte Ihre Eingaben sichern und neu laden.'], 409);
    }
    return $expectedRevision + 1;
}
