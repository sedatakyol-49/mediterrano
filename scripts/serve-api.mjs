import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { phpRuntime, phpString } from "./php-runtime.mjs";

const directory = path.resolve(".local");
const publicDirectory = path.join(directory, "public");
fs.mkdirSync(publicDirectory, { recursive: true });
fs.cpSync("src/assets", path.join(publicDirectory, "assets"), {
  recursive: true,
});
fs.mkdirSync(path.join(publicDirectory, "uploads"), { recursive: true });
const config = path.join(directory, "config.php");
if (!fs.existsSync(config)) {
  fs.writeFileSync(
    config,
    `<?php\nreturn ['dsn' => ${phpString("sqlite:" + path.join(directory, "cms.sqlite"))}, 'secure_cookies' => false, 'public_dir' => ${phpString(publicDirectory)}, 'smtp' => ['host' => '', 'port' => 587, 'user' => '', 'password' => '', 'from' => '', 'to' => '']];\n`,
  );
}
const env = { ...process.env, MEDITERRANO_CONFIG: config };
const { executable, args } = phpRuntime();
execFileSync(executable, [...args, "backend/install.php"], {
  env,
  stdio: "inherit",
});
console.log(
  "Local API: http://127.0.0.1:8081 — create an administrator with npm run admin:create.",
);
const child = spawn(
  executable,
  [...args, "-S", "127.0.0.1:8081", "backend/dev-router.php"],
  { env, stdio: "inherit", windowsHide: true },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill());
child.on("exit", (code) => process.exit(code ?? 0));
