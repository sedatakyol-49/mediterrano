<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

try {
    require dirname(__DIR__, 2) . '/backend/bootstrap.php';
    require dirname(__DIR__, 2) . '/backend/content.php';
    $action = $_GET['action'] ?? 'content';
    $method = $_SERVER['REQUEST_METHOD'];

    if ($action === 'content' && $method === 'GET') {
        $result = document('published');
        $result['content'] = publicContent($result['content']);
        respond($result);
    }

    startAdminSession();
    if ($action === 'session' && $method === 'GET') {
        respond(['user' => $_SESSION['user'] ?? null, 'csrf' => $_SESSION['csrf']]);
    }
    if ($method !== 'GET') {
        requireCsrf();
    }
    if ($action === 'login' && $method === 'POST') {
        $data = input();
        $email = strtolower(textField($data, 'email', 190, true));
        $password = $data['password'] ?? '';
        if (!is_string($password) || strlen($password) > 72 || $password === '') {
            throw new InvalidArgumentException('Ungültiges Passwort.');
        }
        rateLimit('login-ip:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 30, 900);
        rateLimit('login-account:' . $email, 10, 900);
        $query = database()->prepare('SELECT id, email, password_hash FROM cms_users WHERE email = ?');
        $query->execute([$email]);
        $user = $query->fetch();
        $hash = $user['password_hash'] ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        if (!password_verify($password, $hash) || !$user) {
            respond(['message' => 'E-Mail oder Passwort ist falsch.'], 401);
        }
        session_regenerate_id(true);
        $_SESSION['user'] = ['id' => (int) $user['id'], 'email' => $user['email']];
        $_SESSION['last_seen'] = time();
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        respond(['user' => $_SESSION['user'], 'csrf' => $_SESSION['csrf']]);
    }
    if ($action === 'request-offer' && $method === 'POST') {
        require dirname(__DIR__, 2) . '/backend/inquiries.php';
        respond(createInquiry(input()), 201);
    }
    requireAdmin();
    if ($action === 'inquiries') {
        require dirname(__DIR__, 2) . '/backend/inquiries.php';
        if ($method === 'GET') respond(listInquiries());
        if ($method === 'PUT') {
            $data = input(); $id = inquiryId($data);
            $status = textField($data, 'status', 20, true);
            if (!in_array($status, ['new','contacted','quoted','closed'], true) || !is_int($data['revision'] ?? null)) throw new InvalidArgumentException('Ungültiger Status.');
            $current = document($id); $record = $current['content'];
            $record['status'] = $status; $record['notes'] = textField($data, 'notes', 5000);
            respond(['revision'=>saveDocument($id,$record,$data['revision']), 'content'=>$record]);
        }
    }
    if ($action === 'inquiry-email' && $method === 'POST') {
        require dirname(__DIR__, 2) . '/backend/inquiries.php';
        $id = inquiryId(input());
        rateLimit('inquiry-email:' . $id, 3, 3600);
        notifyInquiry($id); respond(document($id));
    }
    if ($action === 'operations' && in_array($method, ['GET', 'PUT'], true)) {
        require dirname(__DIR__, 2) . '/backend/operations.php';
        $current = operationsDocument();
        if ($method === 'GET') respond($current);
        $data = input();
        if (!is_int($data['revision'] ?? null) || !is_array($data['content'] ?? null)) throw new InvalidArgumentException('Ungültige Betriebsdaten.');
        $content = validateOperations($data['content'], $current['content']);
        $revision = saveDocument('operations', $content, $data['revision']);
        respond(['revision'=>$revision, 'content'=>$content]);
    }
    if ($action === 'logout' && $method === 'POST') {
        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/api', 'secure' => config()['secure_cookies'] ?? true, 'httponly' => true, 'samesite' => 'Strict']);
        respond(['success' => true]);
    }
    if ($action === 'draft' && $method === 'GET') {
        respond(document('draft'));
    }
    if ($action === 'draft' && $method === 'PUT') {
        $data = input();
        if (!is_int($data['revision'] ?? null) || !is_array($data['content'] ?? null)) {
            respond(['message' => 'Ungültige Version.'], 422);
        }
        $content = validateContent($data['content']);
        $revision = saveDocument('draft', $content, $data['revision']);
        respond(['revision' => $revision, 'content' => $content]);
    }
    if ($action === 'publish' && $method === 'POST') {
        $data = input();
        $db = database();
        $db->beginTransaction();
        // Updating the draft first acquires a write lock and checks its revision.
        $lock = $db->prepare('UPDATE cms_documents SET revision = revision + 1 WHERE scope = ? AND revision = ?');
        $lock->execute(['draft', $data['revision'] ?? -1]);
        if ($lock->rowCount() !== 1) {
            $db->rollBack();
            respond(['message' => 'Der Entwurf wurde geändert. Bitte neu laden.'], 409);
        }
        $draft = document('draft');
        $content = validateContent($draft['content']);
        $published = $db->prepare('UPDATE cms_documents SET payload = ?, revision = revision + 1, updated_at = ? WHERE scope = ?');
        $published->execute([json_encode($content, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), gmdate('c'), 'published']);
        $db->commit();
        respond($draft);
    }
    if ($action === 'media' && $method === 'GET') {
        respond(['items' => database()->query('SELECT id, path, name, alt FROM cms_media ORDER BY created_at DESC, name')->fetchAll()]);
    }
    if ($action === 'media' && $method === 'DELETE') {
        $id = textField(input(), 'id', 80, true);
        $query = database()->prepare('SELECT path FROM cms_media WHERE id = ?');
        $query->execute([$id]);
        $item = $query->fetch();
        if (!$item) {
            respond(['message' => 'Das Bild wurde bereits entfernt.'], 404);
        }
        // Check both versions, including page HTML and site settings.
        foreach (['draft', 'published'] as $scope) {
            $content = document($scope)['content'];
            if (str_contains(json_encode($content, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), $item['path'])) {
                respond(['message' => 'Dieses Bild wird noch im Entwurf oder auf der veröffentlichten Website verwendet. Bitte zuerst dort ersetzen, speichern und veröffentlichen.'], 409);
            }
        }
        database()->prepare('DELETE FROM cms_media WHERE id = ?')->execute([$id]);
        // Retain original files: old links, cached pages and concurrent drafts stay valid.
        respond(['success' => true]);
    }
    if ($action === 'upload' && $method === 'POST') {
        require dirname(__DIR__, 2) . '/backend/upload.php';
        respond(['item' => uploadImage()], 201);
    }
    respond(['message' => 'Unbekannte Aktion oder HTTP-Methode.'], 404);
} catch (InvalidArgumentException $exception) {
    respond(['message' => $exception->getMessage()], 422);
} catch (Throwable $exception) {
    error_log('Mediterrano API: ' . $exception->getMessage());
    http_response_code(503);
    echo json_encode(['message' => 'Der Dienst ist momentan nicht verfügbar. Bitte die Serverkonfiguration prüfen.']);
}
