import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

export async function testInquiries(request, base) {
  assert.equal(
    (await request("inquiries", { authenticated: false })).status,
    401,
  );
  assert.equal(
    (await request("request-offer", { method: "POST", body: {}, token: "" }))
      .status,
    403,
  );
  const catalog = (await request("content")).data.content;
  const product = catalog.products.find((p) => p.priceCents !== null);
  const body = {
    requestKey: randomBytes(16).toString("hex"),
    name: "PRIVATE INQUIRY",
    email: "customer@example.test",
    phone: "",
    eventDate: "2026-12-20",
    address: "Private address",
    message: "Private wishes",
    guests: 10,
    consent: true,
    website: "",
    items: [
      {
        productId: product.id,
        quantity: 3,
        priceCents: 1,
        name: "Forged name",
      },
    ],
  };
  // Public submission also requires the session CSRF token.
  const sessionResponse = await fetch(base + "/api/index.php?action=session");
  const csrf = (await sessionResponse.json()).csrf;
  const cookie = sessionResponse.headers.get("set-cookie").split(";")[0];
  const anonymous = await fetch(base + "/api/index.php?action=request-offer", {
    method: "POST",
    headers: {
      Cookie: cookie,
      "X-CSRF-Token": csrf,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let created = { status: anonymous.status, data: await anonymous.json() };
  assert.equal(created.status, 201);
  assert.match(created.data.id, /^inq-[a-f0-9]{16}$/);
  assert.deepEqual(
    (await request("request-offer", { method: "POST", body })).data,
    created.data,
    "Retries are idempotent",
  );
  let rows = (await request("inquiries")).data.items;
  assert.equal(rows.length, 1);
  let row = rows[0];
  assert.equal(row.content.items[0].name, product.name);
  assert.equal(row.content.items[0].priceCents, product.priceCents);
  assert.equal(row.content.emailStatus, "not_configured");
  assert.ok(
    !JSON.stringify((await request("content")).data).includes(
      "PRIVATE INQUIRY",
    ),
  );
  const update = {
    id: created.data.id,
    revision: row.revision,
    status: "contacted",
    notes: "Internal note",
  };
  assert.equal(
    (await request("inquiries", { method: "PUT", body: update, token: "" }))
      .status,
    403,
  );
  assert.equal(
    (await request("inquiries", { method: "PUT", body: update })).status,
    200,
  );
  assert.equal(
    (await request("inquiries", { method: "PUT", body: update })).status,
    409,
  );
  row = (
    await request("inquiry-email", {
      method: "POST",
      body: { id: created.data.id },
    })
  ).data;
  assert.equal(row.content.status, "contacted");
  assert.equal(row.content.notes, "Internal note");
  for (const change of [
    { items: [{ productId: "missing", quantity: 1 }] },
    { items: [{ productId: product.id, quantity: 0 }] },
    { eventDate: "2026-02-30" },
    { items: [body.items[0], body.items[0]] },
  ]) {
    assert.equal(
      (
        await request("request-offer", {
          method: "POST",
          body: {
            ...body,
            ...change,
            requestKey: randomBytes(16).toString("hex"),
          },
        })
      ).status,
      422,
    );
  }
  assert.equal(
    (
      await request("request-offer", {
        method: "POST",
        body: { ...body, requestKey: randomBytes(16).toString("hex") },
      })
    ).status,
    429,
  );
  console.log(
    "Inquiry checks passed: CSRF, private access, trusted catalog, idempotency, durable storage without SMTP, revisions, validation and throttling.",
  );
}
