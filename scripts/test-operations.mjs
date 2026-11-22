import assert from "node:assert/strict";

export async function testOperations(request) {
  assert.equal(
    (await request("operations", { authenticated: false })).status,
    401,
  );
  let result = await request("operations");
  assert.equal(result.status, 200);
  assert.deepEqual(result.data.content, {
    labels: [],
    offers: [],
    employees: [],
    shifts: [],
  });
  let revision = result.data.revision;
  const data = {
    labels: [],
    offers: [
      {
        id: "offer-1",
        number: "FORGED",
        title: "Test catering",
        customer: "PRIVATE CUSTOMER",
        address: "Private address",
        email: "test@example.test",
        date: "2026-11-18",
        validUntil: "2026-12-01",
        eventDate: "",
        guests: 35,
        status: "draft",
        priceMode: "gross",
        introduction: "Hello",
        terms: "",
        notes: "PRIVATE NOTES",
        company: "Mediterrano",
        companyAddress: "",
        companyContact: "",
        lines: [
          {
            id: "line-1",
            name: "Plate",
            unit: "Stück",
            quantity: 2,
            unitCents: 2500,
            taxRate: 19,
          },
        ],
      },
    ],
    employees: [
      {
        id: "employee-1",
        name: "PRIVATE EMPLOYEE",
        role: "Service",
        weeklyHours: 20,
        active: true,
      },
    ],
    shifts: [
      {
        id: "shift-1",
        employeeId: "employee-1",
        start: "2026-11-18T22:00",
        end: "2026-11-19T06:00",
        breakMinutes: 30,
        kind: "actual",
        note: "",
      },
    ],
  };
  data.labels.push({
    id: "label-1",
    productId: "",
    name: "Mangoscheiben",
    subtitle: "",
    layout: "package",
    priceCents: 800,
    quantity: 250,
    unit: "g",
    priceBasis: "package",
    bestBefore: "2027-01-20",
    batch: "",
    ingredients: "",
    allergens: "",
    storage: "",
    nutrition: "",
    origin: "",
    image: "",
  });
  const save = (content, rev = revision, extra = {}) =>
    request("operations", {
      method: "PUT",
      body: { content, revision: rev },
      ...extra,
    });
  assert.equal((await save(data, revision, { token: "invalid" })).status, 403);
  result = await save(data);
  assert.equal(result.status, 200);
  revision = result.data.revision;
  const number = result.data.content.offers[0].number;
  assert.match(number, /^ANG-\d{4}-00001$/);
  assert.equal(result.data.content.offers[0].showImages, true);
  assert.equal(result.data.content.offers[0].lines[0].image, '');
  data.offers[0].showImages = false;
  data.offers[0].lines[0].image = 'assets/mediteranno-logo.jpg';
  data.offers[0].lines[0].description = 'Individuelle Beschreibung';
  assert.equal((await save(data, revision - 1)).status, 409);
  for (const mutate of [
    (d) => (d.shifts[0].employeeId = "unknown"),
    (d) => (d.shifts[0].end = d.shifts[0].start),
    (d) => (d.shifts[0].breakMinutes = 500),
    (d) => d.shifts.push({ ...d.shifts[0], id: "shift-2" }),
    (d) => (d.offers[0].lines[0].unitCents = -1),
    (d) => (d.offers[0].date = "2026-02-30"),
    (d) => {
      d.offers[0].status = "sent";
      d.offers[0].lines[0].taxRate = null;
    },
    (d) => d.employees.push({ ...d.employees[0] }),
    (d) => (d.labels[0].quantity = -1),
    (d) => (d.labels[0].image = "javascript:alert(1)"),
    (d) => {
      d.shifts[0].start = "2026-03-29T02:30";
      d.shifts[0].end = "2026-03-29T08:00";
    },
  ]) {
    const invalid = structuredClone(data);
    mutate(invalid);
    assert.equal((await save(invalid)).status, 422);
  }
  result = await save(data);
  assert.equal(result.status, 200);
  assert.equal(result.data.content.offers[0].showImages, false);
  assert.equal(result.data.content.offers[0].lines[0].image, 'assets/mediteranno-logo.jpg');
  assert.equal(result.data.content.offers[0].lines[0].description, 'Individuelle Beschreibung');
  revision = result.data.revision;
  assert.equal(
    result.data.content.offers[0].number,
    number,
    "Existing numbers stay stable",
  );
  data.offers.push({ ...structuredClone(data.offers[0]), id: "offer-2" });
  result = await save(data);
  assert.equal(result.status, 200);
  assert.match(result.data.content.offers[1].number, /00002$/);
  const publicResponse = await request("content", { authenticated: false });
  assert.ok(!JSON.stringify(publicResponse.data).includes("PRIVATE"));
  assert.ok(!Object.hasOwn(publicResponse.data.content, "offers"));
  console.log(
    "Operations checks passed: private access, CSRF, persistence, stable offer numbers, conflicts, invalid dates/prices, missing staff and overlapping shifts.",
  );
}
