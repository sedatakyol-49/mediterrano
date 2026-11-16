import fs from "node:fs";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { execFileSync } from "node:child_process";
import { phpRuntime } from "./php-runtime.mjs";

const prompt = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const email = (await prompt.question("Administrator email: "))
  .trim()
  .toLowerCase();
prompt.close();
process.stdout.write("Password (12–72 bytes, hidden): ");
const output = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});
const hidden = createInterface({
  input: process.stdin,
  output,
  terminal: true,
});
const password = await hidden.question("");
hidden.close();
process.stdout.write("\n");
if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  Buffer.byteLength(password) < 12 ||
  Buffer.byteLength(password) > 72
) {
  throw new Error("Use a valid email and a password between 12 and 72 bytes.");
}
const { executable, args } = phpRuntime();
const hash = execFileSync(
  executable,
  [
    ...args,
    "-r",
    "echo password_hash(stream_get_contents(STDIN), PASSWORD_DEFAULT);",
  ],
  { input: password, encoding: "utf8" },
);
const quote = (value) => "'" + String(value).replaceAll("'", "''") + "'";
const seed = fs.readFileSync("backend/seed.json", "utf8");
const media = JSON.parse(fs.readFileSync("backend/media-seed.json", "utf8"));
const now = new Date().toISOString();
const schema = fs
  .readFileSync("backend/schema.sql", "utf8")
  .replaceAll(");", ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
const statements = [
  "SET NAMES utf8mb4;",
  "SET @previous_sql_mode = @@SESSION.sql_mode;",
  "SET SESSION sql_mode = 'NO_BACKSLASH_ESCAPES';",
  schema,
  "START TRANSACTION;",
];
for (const scope of ["draft", "published"]) {
  statements.push(
    `INSERT IGNORE INTO cms_documents (scope, revision, payload, updated_at) VALUES (${quote(scope)}, 1, ${quote(seed)}, ${quote(now)});`,
  );
}
for (const image of media) {
  statements.push(
    `INSERT IGNORE INTO cms_media (id, path, name, alt, created_at) VALUES (${[image.id, image.path, image.name, image.alt, now].map(quote).join(", ")});`,
  );
}
statements.push(
  `INSERT IGNORE INTO cms_users (id, email, password_hash) VALUES (1, ${quote(email)}, ${quote(hash)});`,
  "COMMIT;",
  "SET SESSION sql_mode = @previous_sql_mode;",
);
fs.mkdirSync(".local", { recursive: true });
fs.writeFileSync(".local/ionos-install.sql", statements.join("\n") + "\n");
console.log(
  "Created .local/ionos-install.sql for the first phpMyAdmin import. Existing administrator credentials and content are not overwritten. Keep this file private.",
);
