CREATE TABLE IF NOT EXISTS cms_users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Each document is a complete, validated site revision. Publishing swaps the
-- public revision atomically, so visitors never see half of a catalog update.
CREATE TABLE IF NOT EXISTS cms_documents (
    scope VARCHAR(20) PRIMARY KEY,
    revision INTEGER NOT NULL,
    payload LONGTEXT NOT NULL,
    updated_at VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_media (
    id VARCHAR(80) PRIMARY KEY,
    path VARCHAR(500) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    alt VARCHAR(500) NOT NULL,
    created_at VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_rate_limits (
    bucket VARCHAR(64) PRIMARY KEY,
    attempts INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
