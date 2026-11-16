import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { phpRuntime } from "./php-runtime.mjs";

const config =
  process.env.MEDITERRANO_CONFIG || path.resolve(".local/config.php");
if (!fs.existsSync(config))
  throw new Error("Run npm run api first, or set MEDITERRANO_CONFIG.");
const input = createInterface({ input: process.stdin, output: process.stdout });
const email = await input.question("Administrator email: ");
input.close();
process.stdout.write("Password (12–72 bytes, hidden): ");
const hiddenOutput = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});
const hidden = createInterface({
  input: process.stdin,
  output: hiddenOutput,
  terminal: true,
});
const password = await hidden.question("");
hidden.close();
process.stdout.write("\n");
const { executable, args } = phpRuntime();
const result = execFileSync(executable, [...args, "backend/admin-user.php"], {
  input: JSON.stringify({ email, password }),
  env: { ...process.env, MEDITERRANO_CONFIG: config },
  encoding: "utf8",
});
console.log(result.trim());
