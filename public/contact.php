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

function sendSmtpMail(
    string $host,
    int $port,
    string $username,
    string $password,
    string $fromEmail,
    string $toEmail,
    string $subject,
    string $body,
    string $replyName,
    string $replyEmail
): void {
    $socket = stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, 30, STREAM_CLIENT_CONNECT);

    if (!$socket) {
        throw new RuntimeException("SMTP-Verbindung fehlgeschlagen: {$errstr}");
    }

    stream_set_timeout($socket, 30);

    expectSmtpCode($socket, [220]);
    smtpCommand($socket, "EHLO mediterrano-em.de", [250]);
    smtpCommand($socket, 'STARTTLS', [220]);

    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        throw new RuntimeException('TLS konnte nicht gestartet werden.');
    }

    smtpCommand($socket, "EHLO mediterrano-em.de", [250]);
    smtpCommand($socket, 'AUTH LOGIN', [334]);
    smtpCommand($socket, base64_encode($username), [334]);
    smtpCommand($socket, base64_encode($password), [235]);
    smtpCommand($socket, "MAIL FROM:<{$fromEmail}>", [250]);
    smtpCommand($socket, "RCPT TO:<{$toEmail}>", [250, 251]);
    smtpCommand($socket, 'DATA', [354]);

    $headers = [
        "From: Mediterrano Website <{$fromEmail}>",
        "Reply-To: {$replyName} <{$replyEmail}>",
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: 8bit"
    ];

    $data = implode("\r\n", $headers)
        . "\r\nSubject: " . encodeHeader($subject)
        . "\r\n\r\n"
        . normalizeMessageBody($body)
        . "\r\n.";

    smtpCommand($socket, $data, [250]);
    smtpCommand($socket, 'QUIT', [221]);
    fclose($socket);
}

function smtpCommand($socket, string $command, array $expectedCodes): string
{
    fwrite($socket, $command . "\r\n");
    return expectSmtpCode($socket, $expectedCodes);
}

function expectSmtpCode($socket, array $expectedCodes): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;

        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    if ($response === '') {
        throw new RuntimeException('Leere SMTP-Antwort erhalten.');
    }

    $code = (int) substr($response, 0, 3);

    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP-Fehler: ' . trim($response));
    }

    return $response;
}

function encodeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function normalizeMessageBody(string $body): string
{
    $normalized = str_replace(["\r\n", "\r"], "\n", $body);
    $normalized = preg_replace('/^\./m', '..', $normalized) ?: $normalized;
    return str_replace("\n", "\r\n", $normalized);
}
