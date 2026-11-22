<?php
declare(strict_types=1);

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
