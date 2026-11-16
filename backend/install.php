<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/content.php';

$db = database();
$schema = file_get_contents(__DIR__ . '/schema.sql');
if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
    $schema = str_replace(');', ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;', $schema);
}
$db->exec($schema);
$seed = validateContent(json_decode(file_get_contents(__DIR__ . '/seed.json'), true, 64, JSON_THROW_ON_ERROR));
$db->beginTransaction();
foreach (['draft', 'published'] as $scope) {
    $query = $db->prepare('SELECT COUNT(*) FROM cms_documents WHERE scope = ?');
    $query->execute([$scope]);
    if ((int) $query->fetchColumn() === 0) {
        $db->prepare('INSERT INTO cms_documents (scope, revision, payload, updated_at) VALUES (?, 1, ?, ?)')
            ->execute([$scope, json_encode($seed, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), gmdate('c')]);
    }
}
foreach (json_decode(file_get_contents(__DIR__ . '/media-seed.json'), true, 64, JSON_THROW_ON_ERROR) as $image) {
    $query = $db->prepare('SELECT COUNT(*) FROM cms_media WHERE id = ?');
    $query->execute([$image['id']]);
    if ((int) $query->fetchColumn() === 0) {
        $db->prepare('INSERT INTO cms_media (id, path, name, alt, created_at) VALUES (?, ?, ?, ?, ?)')
            ->execute([$image['id'], $image['path'], $image['name'], $image['alt'], gmdate('c')]);
    }
}
$db->commit();
echo "Database initialized. Existing content was preserved.\n";
