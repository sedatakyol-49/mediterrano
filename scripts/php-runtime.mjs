import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

export function phpRuntime() {
  const executable = process.env.PHP_BIN || "php";
  const information = JSON.parse(
    execFileSync(
      executable,
      [
        "-r",
        'echo json_encode(["binary" => PHP_BINARY, "modules" => get_loaded_extensions()]);',
      ],
      { encoding: "utf8" },
    ),
  );
  const args = [];
  for (const extension of ["pdo_sqlite", "pdo_mysql", "fileinfo", "gd"]) {
    if (information.modules.includes(extension)) continue;
    const localDll = path.join(
      path.dirname(information.binary),
      "ext",
      `php_${extension}.dll`,
    );
    args.push(
      "-d",
      `extension=${fs.existsSync(localDll) ? localDll : extension}`,
    );
  }
  args.push(
    "-d",
    "upload_max_filesize=8M",
    "-d",
    "post_max_size=10M",
    "-d",
    "display_errors=0",
  );
  return { executable, args };
}

export function phpString(value) {
  return "'" + value.replaceAll("\\", "/").replaceAll("'", "\\'") + "'";
}
