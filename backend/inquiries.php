<?php
declare(strict_types=1);

function inquiryId(array $data): string {
    $id = textField($data, 'id', 20, true);
    if (!preg_match('/^inq-[a-f0-9]{16}$/D', $id)) throw new InvalidArgumentException('Ungültige Anfrage.');
    return $id;
}

function createInquiry(array $data): array {
    if (($data['consent'] ?? false) !== true || textField($data, 'website', 200) !== '') throw new InvalidArgumentException('Bitte bestätigen Sie den Datenschutzhinweis.');
    $key = textField($data, 'requestKey', 64, true);
    if (!preg_match('/^[a-f0-9]{32}$/D', $key)) throw new InvalidArgumentException('Bitte die Seite neu laden.');
    $id = 'inq-' . substr(hash('sha256', $key), 0, 16);
    $existing = database()->prepare('SELECT payload FROM cms_documents WHERE scope = ?');
    $existing->execute([$id]);
    if ($existing->fetchColumn()) return ['id' => $id, 'success' => true];
    rateLimit('inquiry:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 5, 3600);
    $customer = [];
    foreach (['name'=>200, 'email'=>190, 'phone'=>80, 'eventDate'=>10, 'address'=>1000, 'message'=>5000] as $field=>$limit) $customer[$field] = textField($data, $field, $limit, in_array($field, ['name','email'], true));
    if (!filter_var($customer['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $customer['email'])) throw new InvalidArgumentException('Bitte eine gültige E-Mail-Adresse eingeben.');
    $date = $customer['eventDate'];
    if ($date !== '' && (!preg_match('/^\d{4}-\d{2}-\d{2}$/D', $date) || !($parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $date)) || $parsed->format('Y-m-d') !== $date)) throw new InvalidArgumentException('Ungültiges Veranstaltungsdatum.');
    $guests = $data['guests'] ?? null;
    if ($guests !== null && (!is_int($guests) || $guests < 1 || $guests > 10000)) throw new InvalidArgumentException('Bitte die Personenzahl prüfen.');
    $rows = $data['items'] ?? null;
    if (!is_array($rows) || !array_is_list($rows) || count($rows) < 1 || count($rows) > 100) throw new InvalidArgumentException('Bitte mindestens ein Produkt auswählen.');
    $published = publicContent(document('published')['content']);
    $catalog = array_column($published['products'], null, 'id');
    $items = []; $seen = [];
    foreach ($rows as $row) {
        if (!is_array($row)) throw new InvalidArgumentException('Ungültige Position.');
        $productId = textField($row, 'productId', 80, true);
        $quantity = $row['quantity'] ?? null;
        if (!isset($catalog[$productId]) || isset($seen[$productId]) || !is_int($quantity) || $quantity < 1 || $quantity > 1000) throw new InvalidArgumentException('Ein Produkt ist nicht mehr verfügbar oder die Menge ist ungültig. Bitte die Auswahl prüfen.');
        $seen[$productId] = true; $product = $catalog[$productId];
        $items[] = ['productId'=>$productId, 'name'=>$product['name'], 'image'=>$product['image'], 'description'=>$product['description'], 'quantity'=>$quantity, 'priceMode'=>$product['priceMode'], 'priceCents'=>$product['priceCents']];
    }
    $record = ['id'=>$id, 'createdAt'=>gmdate('c'), 'status'=>'new', 'customer'=>$customer, 'guests'=>$guests, 'items'=>$items, 'consentAt'=>gmdate('c'), 'notes'=>'', 'emailStatus'=>'pending'];
    $insert = database()->prepare('INSERT INTO cms_documents (scope,revision,payload,updated_at) VALUES (?,1,?,?)');
    try { $insert->execute([$id,json_encode($record, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),gmdate('c')]); }
    catch (PDOException $exception) {
        $existing->execute([$id]);
        if (!$existing->fetchColumn()) throw $exception;
        return ['id'=>$id, 'success'=>true];
    }
    notifyInquiry($id);
    return ['id'=>$id, 'success'=>true];
}

function notifyInquiry(string $id): void {
    $record = document($id)['content'];
    $smtp = config()['smtp'] ?? [];
    $status = 'not_configured';
    if (!empty($smtp['password']) && !empty($smtp['to'])) {
        try {
            require_once __DIR__ . '/mail.php';
            $customer = $record['customer'];
            $body = "Neue Angebotsanfrage: {$id}\n\n";
            foreach ($customer as $key=>$value) $body .= "$key: $value\n";
            $body .= 'Personen: ' . ($record['guests'] ?? 'offen') . "\n\n";
            foreach ($record['items'] as $item) $body .= $item['quantity'] . ' × ' . $item['name'] . "\n";
            $body .= "\nBearbeiten: https://mediterrano-em.de/admin\nBereich: Kundenanfragen\n";
            sendSmtpMail($smtp['host'], (int)$smtp['port'], $smtp['user'], $smtp['password'], $smtp['from'], $smtp['to'], 'Neue Angebotsanfrage ' . $id, $body, 'Website-Kunde', $customer['email']);
            $status = 'accepted';
        } catch (Throwable $exception) { $status = 'failed'; }
    }
    // Lock before merging so an administrator's concurrent status edit is preserved.
    $db = database(); $db->beginTransaction();
    try {
        $db->prepare('UPDATE cms_documents SET revision = revision + 1 WHERE scope = ?')->execute([$id]);
        $current = document($id); $current['content']['emailStatus'] = $status;
        $current['content']['emailAttemptAt'] = gmdate('c');
        saveDocument($id, $current['content'], $current['revision']);
        $db->commit();
    } catch (Throwable $exception) { if ($db->inTransaction()) $db->rollBack(); throw $exception; }
}

function listInquiries(): array {
    $query = database()->query("SELECT revision,payload FROM cms_documents WHERE scope LIKE 'inq-%' ORDER BY scope");
    $items = [];
    foreach ($query as $row) $items[] = ['revision'=>(int)$row['revision'], 'content'=>json_decode($row['payload'], true, 64, JSON_THROW_ON_ERROR)];
    usort($items, fn($a,$b)=>strcmp($b['content']['createdAt'],$a['content']['createdAt']));
    return ['items'=>$items];
}
