import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { once } from "node:events";
import { randomBytes } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { phpRuntime, phpString } from "./php-runtime.mjs";

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "mediterrano-api-"));
const publicDirectory = path.join(temporary, "public");
fs.mkdirSync(publicDirectory);
fs.cpSync("src/assets", path.join(publicDirectory, "assets"), {
  recursive: true,
});
const config = path.join(temporary, "config.php");
fs.writeFileSync(
  config,
  `<?php return ['dsn' => ${phpString("sqlite:" + path.join(temporary, "cms.sqlite"))}, 'secure_cookies' => false, 'public_dir' => ${phpString(publicDirectory)}];`,
);
const env = { ...process.env, MEDITERRANO_CONFIG: config };
const runtime = phpRuntime();
function php(file, input) {
  return execFileSync(runtime.executable, [...runtime.args, file], {
    env,
    input,
    encoding: "utf8",
  });
}
let server;
let serverError = "";
try {
  php("backend/install.php");
  php("backend/install.php"); // A repeated setup must preserve data and media.
  const email = "integration@example.test";
  const password = randomBytes(24).toString("hex");
  php("backend/admin-user.php", JSON.stringify({ email, password }));
  const socket = net.createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  server = spawn(
    runtime.executable,
    [...runtime.args, "-S", `127.0.0.1:${port}`, "backend/dev-router.php"],
    { env, stdio: ["ignore", "ignore", "pipe"], windowsHide: true },
  );
  server.stderr.on("data", (data) => {
    serverError += data.toString();
  });
  const base = `http://127.0.0.1:${port}`;
  let cookie = "";
  let csrf = "";
  async function request(
    action,
    { method = "GET", body, authenticated = true, token = csrf } = {},
  ) {
    const headers = {};
    if (authenticated && cookie) headers.Cookie = cookie;
    if (token) headers["X-CSRF-Token"] = token;
    if (body && !(body instanceof FormData))
      headers["Content-Type"] = "application/json";
    const response = await fetch(`${base}/api/index.php?action=${action}`, {
      method,
      headers,
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie && authenticated) cookie = setCookie.split(";")[0];
    return {
      status: response.status,
      data: await response.json(),
      headers: response.headers,
    };
  }
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      await fetch(base);
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  let response = await request("content", { authenticated: false });
  assert.equal(response.status, 200);
  const original = response.data;
  assert.equal(
    original.content.products.filter((product) =>
      ["fixed", "person"].includes(product.priceMode),
    ).length,
    25,
  );
  assert.equal((await request("draft", { authenticated: false })).status, 401);
  response = await request("session");
  csrf = response.data.csrf;
  assert.match(response.headers.get("set-cookie") || "", /HttpOnly/i);
  assert.match(response.headers.get("set-cookie") || "", /SameSite=Strict/i);
  assert.equal(
    (
      await request("login", {
        method: "POST",
        token: "invalid",
        body: { email, password },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("login", {
        method: "POST",
        body: { email, password: "wrong" },
      })
    ).status,
    401,
  );
  response = await request("login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(response.status, 200);
  csrf = response.data.csrf;
  let draft = (await request("draft")).data;
  const changed = structuredClone(draft.content);
  changed.products[0].priceCents = 1625;
  changed.settings.heroTitle = "Integration test title";
  response = await request("draft", {
    method: "PUT",
    body: { content: changed, revision: draft.revision },
  });
  assert.equal(response.status, 200);
  draft = response.data;
  assert.equal(
    (await request("content", { authenticated: false })).data.content
      .products[0].priceCents,
    original.content.products[0].priceCents,
  );
  assert.equal(
    (
      await request("draft", {
        method: "PUT",
        body: { content: changed, revision: draft.revision - 1 },
      })
    ).status,
    409,
  );
  for (const mutate of [
    (content) => {
      content.products[0].categoryId = "missing";
    },
    (content) => {
      content.products[0].priceCents = -1;
    },
    (content) => {
      content.products[0].image = "uploads/../secret.php";
    },
    (content) => {
      content.products.push({ ...content.products[0] });
    },
    (content) => {
      content.settings.facebookUrl = "javascript:alert(1)";
    },
  ]) {
    const invalid = structuredClone(changed);
    mutate(invalid);
    assert.equal(
      (
        await request("draft", {
          method: "PUT",
          body: { content: invalid, revision: draft.revision },
        })
      ).status,
      422,
    );
  }
  const media = (await request("media")).data.items;
  assert.equal(new Set(media.map((image) => image.id)).size, media.length);
  assert.ok(media.length >= 94);
  const invalidUpload = new FormData();
  invalidUpload.append(
    "image",
    new Blob(['<?php echo "invalid"; ?>'], { type: "image/jpeg" }),
    "evil.jpg",
  );
  assert.equal(
    (await request("upload", { method: "POST", body: invalidUpload })).status,
    422,
  );
  const upload = new FormData();
  upload.append(
    "image",
    new Blob(
      [fs.readFileSync("src/assets/mediterrano-gallery/mediterrano-004.jpeg")],
      { type: "image/jpeg" },
    ),
    "product.jpg",
  );
  upload.append("alt", "Integration photo");
  response = await request("upload", { method: "POST", body: upload });
  assert.equal(response.status, 201);
  assert.match(response.data.item.path, /^uploads\/[a-f0-9]{32}\.webp$/);
  const image = await fetch(base + "/" + response.data.item.path);
  assert.equal(image.headers.get("content-type"), "image/webp");
  const bytes = Buffer.from(await image.arrayBuffer());
  assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
  changed.products[0].image = response.data.item.path;
  changed.categories[1].visible = false;
  draft = (
    await request("draft", {
      method: "PUT",
      body: { content: changed, revision: draft.revision },
    })
  ).data;
  assert.equal(
    (
      await request("publish", {
        method: "POST",
        body: { revision: draft.revision - 1 },
      })
    ).status,
    409,
  );
  response = await request("publish", {
    method: "POST",
    body: { revision: draft.revision },
  });
  assert.equal(response.status, 200);
  const published = (await request("content", { authenticated: false })).data
    .content;
  assert.equal(published.products[0].priceCents, 1625);
  assert.equal(published.settings.heroTitle, changed.settings.heroTitle);
  assert.ok(
    !published.products.some(
      (product) => product.categoryId === changed.categories[1].id,
    ),
  );
  assert.ok(
    !published.categories.some(
      (category) => category.id === changed.categories[1].id,
    ),
  );
  assert.equal(
    (await request("logout", { method: "POST", body: {} })).status,
    200,
  );
  assert.equal((await request("draft")).status, 401);
  csrf = (await request("session")).data.csrf;
  let throttled = false;
  for (let attempt = 0; attempt < 12; attempt++) {
    const failed = await request("login", {
      method: "POST",
      body: { email, password: "wrong" },
    });
    if (failed.status === 429) {
      throttled = true;
      break;
    }
  }
  assert.ok(throttled, "Failed logins must be rate limited");
  console.log(
    "API integration checks passed: seeding, sessions, CSRF, authorization, validation, draft isolation, revision conflicts, image upload, publication, visibility, logout and throttling.",
  );
} catch (error) {
  console.error(serverError.slice(-3000));
  throw error;
} finally {
  if (server && server.exitCode === null) {
    const ended = once(server, "exit");
    server.kill();
    await ended;
  }
  const resolved = path.resolve(temporary);
  if (
    path.dirname(resolved) !== path.resolve(os.tmpdir()) ||
    !path.basename(resolved).startsWith("mediterrano-api-")
  )
    throw new Error("Refusing cleanup outside the test directory");
  fs.rmSync(resolved, { recursive: true, force: true });
}
