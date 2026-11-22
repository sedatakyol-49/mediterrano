<?php
declare(strict_types=1);

// Copy to config.local.php outside the public document root. Never commit secrets.
return [
    'dsn' => 'mysql:host=db5021919185.hosting-data.io;port=3306;dbname=dbs16345646;charset=utf8mb4',
    'db_user' => 'dbu161884',
    'db_password' => '',
    'secure_cookies' => true,
    'public_dir' => dirname(__DIR__) . '/public',
    'smtp' => [
        'host' => 'smtp.ionos.de',
        'port' => 587,
        'user' => 'info@mediterrano-em.de',
        'password' => '',
        'from' => 'info@mediterrano-em.de',
        'to' => 'info@mediterrano-em.de',
    ],
];
