import fs from "node:fs";
import path from "node:path";

const build = path.resolve("dist/frontend-med/browser");
if (!fs.existsSync(path.join(build, "index.html")))
  throw new Error("Run npm run build first.");
const output = path.resolve("deploy");
fs.mkdirSync(output, { recursive: true });
fs.cpSync(build, path.join(output, "public"), { recursive: true });
fs.mkdirSync(path.join(output, "backend"), { recursive: true });
const files = [
  "bootstrap.php",
  "content.php",
  "upload.php",
  "config.example.php",
  "schema.sql",
  "install.php",
  "admin-user.php",
  "seed.json",
  "media-seed.json",
  ".htaccess",
];
for (const file of files)
  fs.copyFileSync(
    path.join("backend", file),
    path.join(output, "backend", file),
  );
console.log(
  "IONOS package prepared in deploy/. Set the domain document root to deploy/public and configure backend/config.local.php on the server.",
);
console.log(
  "Preserve existing uploads and configuration when deploying an update.",
);
