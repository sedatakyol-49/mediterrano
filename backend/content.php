<?php
declare(strict_types=1);

function textField(array $data, string $key, int $max, bool $required = false): string
{
    $value = $data[$key] ?? '';
    if (!is_string($value) || strlen($value) > $max || ($required && trim($value) === '')) {
        throw new InvalidArgumentException('Ungültiges Feld: ' . $key);
    }
    return trim($value);
}

function identifier(array $data, string $key = 'id'): string
{
    $value = textField($data, $key, 100, true);
    if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $value)) {
        throw new InvalidArgumentException('Ungültige Kennung: ' . $key);
    }
    return $value;
}

function mediaPath(string $path): string
{
    if ($path === '') {
        return '';
    }
    if (!preg_match('~^(assets/|uploads/)[^\\\\\x00-\x1f]+\.(jpe?g|png|webp|gif)$~iu', $path) || str_contains($path, '..')) {
        throw new InvalidArgumentException('Ungültiger Bildpfad.');
    }
    $full = realpath(config()['public_dir'] . '/' . $path);
    $root = realpath(config()['public_dir']);
    if (!$full || !$root || !str_starts_with($full, $root . DIRECTORY_SEPARATOR) || !is_file($full)) {
        throw new InvalidArgumentException('Das ausgewählte Bild ist nicht vorhanden.');
    }
    return $path;
}

function validateContent(array $content): array
{
    foreach (['categories', 'products', 'pages', 'settings'] as $key) {
        if (!isset($content[$key]) || !is_array($content[$key])) {
            throw new InvalidArgumentException('Fehlender Bereich: ' . $key);
        }
    }
    if (count($content['products']) > 1000 || count($content['categories']) > 100 || count($content['pages']) > 30) {
        throw new InvalidArgumentException('Zu viele Einträge.');
    }
    $categories = [];
    foreach ($content['categories'] as $row) {
        if (!is_array($row)) { throw new InvalidArgumentException('Ungültige Kategorie.'); }
        $id = identifier($row);
        if (isset($categories[$id])) { throw new InvalidArgumentException('Doppelte Kategorie.'); }
        $categories[$id] = [
            'id' => $id,
            'title' => textField($row, 'title', 200, true),
            'description' => textField($row, 'description', 2000),
            'visible' => ($row['visible'] ?? true) === true,
        ];
    }
    $products = [];
    foreach ($content['products'] as $row) {
        if (!is_array($row)) { throw new InvalidArgumentException('Ungültiges Produkt.'); }
        $id = identifier($row);
        $categoryId = identifier($row, 'categoryId');
        if (!isset($categories[$categoryId]) || isset($products[$id])) {
            throw new InvalidArgumentException('Produktkennung oder Kategorie ungültig.');
        }
        $priceMode = $row['priceMode'] ?? 'request';
        if (!in_array($priceMode, ['fixed', 'person', 'weight', 'request'], true)) {
            throw new InvalidArgumentException('Ungültiger Preistyp.');
        }
        $cents = $row['priceCents'] ?? null;
        if (in_array($priceMode, ['fixed', 'person'], true) && (!is_int($cents) || $cents < 0 || $cents > 10000000)) {
            throw new InvalidArgumentException('Ungültiger Preis.');
        }
        $products[$id] = [
            'id' => $id, 'categoryId' => $categoryId,
            'name' => textField($row, 'name', 200, true),
            'description' => textField($row, 'description', 4000),
            'priceMode' => $priceMode,
            'priceCents' => in_array($priceMode, ['fixed', 'person'], true) ? $cents : null,
            'image' => mediaPath(textField($row, 'image', 500)),
            'imageAlt' => textField($row, 'imageAlt', 500),
            'visible' => ($row['visible'] ?? true) === true,
            'featured' => ($row['featured'] ?? false) === true,
            'deli' => ($row['deli'] ?? false) === true,
            'breakfast' => ($row['breakfast'] ?? false) === true,
        ];
    }
    $pages = [];
    foreach ($content['pages'] as $row) {
        if (!is_array($row)) { throw new InvalidArgumentException('Ungültige Seite.'); }
        $id = identifier($row);
        if (isset($pages[$id])) { throw new InvalidArgumentException('Doppelte Seite.'); }
        $pages[$id] = [
            'id' => $id, 'title' => textField($row, 'title', 200, true),
            'description' => textField($row, 'description', 1000),
            'body' => textField($row, 'body', 100000),
        ];
    }
    // Fixed site routes always need a content record, even if their body is empty.
    foreach (['home', 'produkte', 'ueber-uns', 'kontakt', 'impressum', 'datenschutz', 'agb'] as $id) {
        if (!isset($pages[$id])) { throw new InvalidArgumentException('Fehlende Seite: ' . $id); }
    }
    $settings = [];
    $defaults = json_decode(file_get_contents(__DIR__ . '/seed.json'), true, 64, JSON_THROW_ON_ERROR)['settings'];
    foreach ($defaults as $key => $default) {
        $settings[$key] = textField($content['settings'], $key, 10000);
        if (str_ends_with($key, 'Image')) {
            $settings[$key] = mediaPath($settings[$key]);
        }
        if (str_ends_with($key, 'Url') && $settings[$key] !== '' && !preg_match('~^https://[^\s]+$~', $settings[$key])) {
            throw new InvalidArgumentException('Bitte eine HTTPS-Adresse eingeben: ' . $key);
        }
    }
    if (!filter_var($settings['email'], FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Ungültige E-Mail-Adresse.');
    }
    return ['categories' => array_values($categories), 'products' => array_values($products), 'pages' => array_values($pages), 'settings' => $settings];
}

function publicContent(array $content): array
{
    $content['categories'] = array_values(array_filter($content['categories'], fn($row) => $row['visible']));
    $ids = array_column($content['categories'], 'id');
    $content['products'] = array_values(array_filter($content['products'], fn($row) => $row['visible'] && in_array($row['categoryId'], $ids, true)));
    return $content;
}
