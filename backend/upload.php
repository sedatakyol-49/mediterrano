<?php
declare(strict_types=1);

function uploadImage(): array
{
    $file = $_FILES['image'] ?? null;
    if (!$file || !is_array($file) || $file['error'] !== UPLOAD_ERR_OK || $file['size'] > 8 * 1024 * 1024) {
        throw new InvalidArgumentException('Bitte ein Bild bis 8 MB hochladen.');
    }
    if (!extension_loaded('gd') || !extension_loaded('fileinfo')) {
        throw new RuntimeException('The GD and Fileinfo PHP extensions are required for image uploads.');
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    if (!isset($extensions[$mime]) || !is_uploaded_file($file['tmp_name'])) {
        throw new InvalidArgumentException('Erlaubt sind JPG, PNG und WebP.');
    }
    $size = getimagesize($file['tmp_name']);
    if (!$size || $size[0] * $size[1] > 20_000_000 || $size[0] < 1 || $size[1] < 1) {
        throw new InvalidArgumentException('Das Bild darf höchstens 20 Megapixel haben.');
    }
    $source = imagecreatefromstring(file_get_contents($file['tmp_name']));
    if (!$source) {
        throw new InvalidArgumentException('Das Bild konnte nicht gelesen werden.');
    }
    $scale = min(1, 2000 / max($size[0], $size[1]));
    $width = max(1, (int) round($size[0] * $scale));
    $height = max(1, (int) round($size[1] * $scale));
    $image = imagecreatetruecolor($width, $height);
    imagealphablending($image, false);
    imagesavealpha($image, true);
    imagecopyresampled($image, $source, 0, 0, 0, 0, $width, $height, $size[0], $size[1]);
    $id = bin2hex(random_bytes(16));
    $path = 'uploads/' . $id . '.webp';
    $directory = config()['public_dir'] . '/uploads';
    if (!is_dir($directory) && !mkdir($directory, 0755, true)) {
        throw new RuntimeException('Upload directory cannot be created.');
    }
    // Re-encoding strips embedded metadata and prevents executable upload payloads.
    $saved = imagewebp($image, config()['public_dir'] . '/' . $path, 85);
    imagedestroy($image);
    imagedestroy($source);
    if (!$saved) {
        throw new RuntimeException('Image encoding failed.');
    }
    $name = basename(str_replace('\\', '/', (string) $file['name']));
    $name = substr($name, 0, 200);
    $alt = textField($_POST, 'alt', 500);
    try {
        database()->prepare('INSERT INTO cms_media (id, path, name, alt, created_at) VALUES (?, ?, ?, ?, ?)')
            ->execute([$id, $path, $name, $alt, gmdate('c')]);
    } catch (Throwable $exception) {
        unlink(config()['public_dir'] . '/' . $path);
        throw $exception;
    }
    return ['id' => $id, 'path' => $path, 'name' => $name, 'alt' => $alt];
}
