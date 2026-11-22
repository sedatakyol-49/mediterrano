import {
  LabelRecord,
  Offer,
  basePrice,
  offerTotals,
} from '../../models/operations';

const escape = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
export const euros = (cents: number | null) =>
  cents === null
    ? '—'
    : new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(cents / 100);
export const germanDate = (date: string) =>
  date ? date.split('-').reverse().join('.') : '';
function safeImage(path: string): string {
  if (
    !/^(assets|uploads)\/[^<>"'\\]+\.(jpe?g|png|webp|gif)$/i.test(path) ||
    path.includes('..')
  )
    return '';
  return escape(new URL(path, location.origin + '/').href);
}
function image(path: string, className = ''): string {
  const src = safeImage(path);
  return src ? `<img class="${className}" src="${src}" alt="">` : '';
}
export function printShell(
  title: string,
  content: string,
  css = '',
  pageSize = 'A4',
  margin = 12,
): string {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${escape(title)}</title><style>
  *{box-sizing:border-box}body{margin:0;background:#e9ece7;color:#20372c;font:14px Arial,sans-serif}h1,h2,p{margin:0 0 12px}img{object-fit:contain} .controls{padding:18px;background:#20372c;color:white;position:sticky;top:0;z-index:2;display:flex;gap:20px;align-items:center;flex-wrap:wrap}button{padding:12px 20px;background:white;border:0;border-radius:4px;cursor:pointer;font-weight:bold}button:disabled{opacity:.5}.paper{background:white;width:210mm;min-height:297mm;margin:20px auto;padding:12mm;box-shadow:0 2px 12px #0002}.multiline{white-space:pre-line;overflow-wrap:anywhere}.print-warning{color:#ffdba1}.muted{color:#58675f}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:10px 6px;border-bottom:1px solid #dce1da}thead{display:table-header-group}tr{break-inside:avoid}.right{text-align:right;white-space:nowrap}footer{margin-top:22px;border-top:1px solid #dce1da;padding-top:12px;font-size:11px}
  ${css}
  @page{size:${pageSize};margin:${margin}mm}@media print{body{background:white}.controls{display:none}.paper{box-shadow:none;margin:0;padding:0;width:auto;min-height:0}.paper+.paper{break-before:page}h1,h2{break-after:avoid}a{color:inherit;text-decoration:none}}
  </style></head><body><div class="controls"><button id="print" disabled>Drucken / als PDF speichern</button><span id="print-status">Druckvorschau wird vorbereitet …</span></div>${content}</body></html>`;
}
export function openPrintPreview(html: string): void {
  const preview = window.open('', '_blank');
  if (!preview)
    throw new Error('Bitte Pop-ups für die Druckvorschau erlauben.');
  preview.opener = null;
  preview.document.open();
  preview.document.write(html);
  preview.document.close();
  const ready = async () => {
    await Promise.all(
      [...preview.document.images].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
      ),
    );
    await preview.document.fonts.ready;
    const overflow = [
      ...preview.document.querySelectorAll<HTMLElement>('.label'),
    ].some(
      (el) =>
        el.scrollHeight > el.clientHeight + 1 ||
        el.scrollWidth > el.clientWidth + 1,
    );
    const failedImage = [...preview.document.images].some(
      (img) => !img.naturalWidth,
    );
    const button = preview.document.getElementById(
      'print',
    ) as HTMLButtonElement;
    const status = preview.document.getElementById('print-status')!;
    button.disabled = overflow || failedImage;
    status.textContent = overflow
      ? 'Text passt nicht auf das Etikett. Bitte Maße vergrößern oder Text kürzen.'
      : failedImage
        ? 'Ein Bild konnte nicht geladen werden. Bitte die Vorschau erneut öffnen.'
        : 'Maßstab 100 % · Kopf- und Fußzeilen ausschalten · Papierformat wie in der Vorschau wählen';
    if (button.disabled) status.className = 'print-warning';
    button.addEventListener('click', () => {
      preview.focus();
      preview.print();
    });
  };
  if (preview.document.readyState === 'complete') void ready();
  else preview.addEventListener('load', () => void ready(), { once: true });
}
export interface LabelPrintSettings {
  width: number;
  height: number;
  margin: number;
  gap: number;
  paper: 'a4' | 'single';
}
export function labelsDocument(
  labels: LabelRecord[],
  settings: LabelPrintSettings,
  company: Record<string, string>,
): string {
  const { width: w, height: h, margin: m, gap: g } = settings;
  if (
    ![w, h, m, g].every(Number.isFinite) ||
    w < 40 ||
    w > 190 ||
    h < 25 ||
    h > 277 ||
    m < 0 ||
    m > 25 ||
    g < 0 ||
    g > 15
  )
    throw new Error('Bitte gültige Etikettenmaße eingeben.');
  const cols =
    settings.paper === 'single' ? 1 : Math.floor((210 - 2 * m + g) / (w + g));
  const rows =
    settings.paper === 'single' ? 1 : Math.floor((297 - 2 * m + g) / (h + g));
  if (cols < 1 || rows < 1 || !labels.length || labels.length > 200)
    throw new Error(
      'Die Etiketten passen nicht auf die Seite oder die Auswahl ist leer (maximal 200).',
    );
  const labelHtml = (l: LabelRecord) => {
    const basis =
      l.priceBasis === '100g'
        ? '/ 100 g'
        : l.priceBasis === '100ml'
          ? '/ 100 ml'
          : l.priceBasis === 'piece'
            ? '/ Stück'
            : '';
    const base = basePrice(l);
    const baseUnit =
      l.priceBasis === '100ml' ||
      (l.priceBasis === 'package' && l.unit === 'ml')
        ? 'l'
        : 'kg';
    return `<article class="label ${escape(l.layout)}"><header>${image(company['logoImage'] || '', 'logo')}<div><h2>${escape(l.name)}</h2>${l.subtitle ? `<p>${escape(l.subtitle)}</p>` : ''}</div></header>${l.layout === 'detail' ? image(l.image, 'product-photo') : ''}<div class="price">${escape(euros(l.priceCents))}<small> ${basis}</small></div>${l.quantity !== null && l.priceBasis === 'package' ? `<p>Inhalt: ${escape(l.quantity)} ${escape(l.unit)}</p>` : ''}${base !== null ? `<p class="base">Grundpreis: ${escape(euros(base))} / ${baseUnit}</p>` : ''}${l.bestBefore ? `<p>Mindestens haltbar bis: ${germanDate(l.bestBefore)}</p>` : ''}${l.batch ? `<p>Charge: ${escape(l.batch)}</p>` : ''}${(['ingredients', 'allergens', 'storage', 'nutrition', 'origin'] as const).map((key, i) => (l[key] ? `<p class="detail-text"><b>${['Zutaten', 'Allergene', 'Lagerung', 'Nährwerte', 'Herkunft'][i]}:</b> ${escape(l[key])}</p>` : '')).join('')}${l.layout === 'package' ? `<p class="producer">${escape(company['businessName'])} · ${escape(company['street'])} · ${escape(company['postalCode'])} ${escape(company['city'])}</p>` : ''}</article>`;
  };
  const pages = [];
  for (let i = 0; i < labels.length; i += cols * rows)
    pages.push(
      `<section class="paper"><div class="label-sheet">${labels
        .slice(i, i + cols * rows)
        .map(labelHtml)
        .join('')}</div></section>`,
    );
  return printShell(
    'Mediterrano · Etiketten',
    pages.join(''),
    `
    .paper{padding:${m}mm;${settings.paper === 'single' ? `width:${w}mm;min-height:${h}mm;` : ''}}
    .label-sheet{display:grid;grid-template-columns:repeat(${cols},${w}mm);gap:${g}mm;align-content:start}
    .label{width:${w}mm;height:${h}mm;border:.2mm solid #929d94;padding:3mm;color:#17291e;font-size:9pt;line-height:1.25;overflow:hidden;break-inside:avoid;overflow-wrap:anywhere}
    .label header{display:flex;gap:2mm;align-items:center;margin-bottom:2mm}.label h2{font-size:12pt;line-height:1.15;margin:0 0 1mm}.label p{margin:0 0 1mm}.logo{width:13mm;height:10mm}.price{font-size:20pt;font-weight:700;margin:1mm 0}.price small{font-size:9pt;font-weight:400}.detail-text,.producer,.base{font-size:8pt}.product-photo{float:left;width:24mm;height:25mm;margin:0 3mm 2mm 0}.counter h2{font-size:14pt}.counter .price{font-size:24pt}.detail header{border-bottom:.5mm solid #334e3c;padding-bottom:2mm}.producer{margin-top:2mm!important;color:#58675f}
    .package header{margin-bottom:1mm}.package .producer{margin-top:1mm!important}
    @media print{.paper{padding:0;min-height:0}.label{border-color:#bbb}}
  `,
    settings.paper === 'single' ? `${w}mm ${h}mm` : 'A4',
    settings.paper === 'single' ? 0 : m,
  );
}
export function offerDocument(offer: Offer, logo: string): string {
  const totals = offerTotals(offer);
  if (
    !offer.number ||
    !offer.customer.trim() ||
    !offer.lines.length ||
    !totals.complete
  )
    throw new Error(
      'Bitte zuerst speichern sowie Kunde, Positionen und Steuersätze ergänzen.',
    );
  const body = `<section class="paper"><header class="brand">${image(logo, 'logo')}<div><h2>${escape(offer.company)}</h2><p class="multiline muted">${escape(offer.companyAddress)}</p><p class="multiline muted">${escape(offer.companyContact)}</p></div></header><div class="addresses"><div><small>ANGEBOT FÜR</small><h2>${escape(offer.customer)}</h2><p class="multiline">${escape(offer.address)}</p>${escape(offer.email)}</div><dl><dt>Angebotsnummer</dt><dd>${escape(offer.number)}</dd><dt>Datum</dt><dd>${germanDate(offer.date)}</dd>${offer.validUntil ? `<dt>Gültig bis</dt><dd>${germanDate(offer.validUntil)}</dd>` : ''}${offer.eventDate ? `<dt>Veranstaltung</dt><dd>${germanDate(offer.eventDate)}</dd>` : ''}${offer.guests ? `<dt>Personen</dt><dd>${offer.guests}</dd>` : ''}</dl></div><h1>${escape(offer.title)}</h1><p class="multiline intro">${escape(offer.introduction)}</p><table><thead><tr><th>Pos.</th><th>Beschreibung</th><th class="right">Menge</th><th class="right">Einzelpreis</th><th class="right">MwSt.</th><th class="right">Gesamt</th></tr></thead><tbody>${offer.lines.map((line, i) => `<tr><td>${i + 1}</td><td>${offer.showImages !== false && line.image ? image(line.image, 'offer-photo') : ''}<strong>${escape(line.name)}</strong>${line.description ? `<div class="multiline line-description">${escape(line.description)}</div>` : ''}</td><td class="right">${escape(line.quantity)} ${escape(line.unit)}</td><td class="right">${euros(line.unitCents)}</td><td class="right">${line.taxRate} %</td><td class="right">${euros(Math.round(line.quantity * line.unitCents))}</td></tr>`).join('')}</tbody></table><p class="muted pricing">Positionspreise ${offer.priceMode === 'gross' ? 'inklusive' : 'zuzüglich'} Mehrwertsteuer.</p><div class="totals"><p><span>Netto</span><b>${euros(totals.net)}</b></p>${totals.taxes.map(([rate, tax]) => `<p><span>MwSt. ${rate} %</span><span>${euros(tax)}</span></p>`).join('')}<p class="grand"><span>Gesamtbetrag</span><b>${euros(totals.gross)}</b></p></div><section class="conditions"><h2>Konditionen</h2><p class="multiline">${escape(offer.terms)}</p></section><footer>${escape(offer.company)} · ${escape(offer.companyContact)}</footer></section>`;
  return printShell(
    offer.number,
    body,
    `.brand{display:flex;align-items:center;justify-content:space-between;gap:25px;padding-bottom:22px;border-bottom:3px solid #304c38}.brand .logo{width:100px;height:85px}.brand div{text-align:right}.brand h2{font:24px Georgia,serif}.addresses{display:flex;justify-content:space-between;gap:30px;margin:35px 0}.addresses>div{max-width:55%}small{letter-spacing:2px;font-size:10px}dl{margin:0;display:grid;grid-template-columns:auto auto;gap:8px 20px;font-size:12px}dd{margin:0;font-weight:bold}h1{font:32px Georgia,serif}.intro{margin:18px 0 25px}.pricing{font-size:11px;margin-top:8px}.totals{margin:20px 0 30px auto;max-width:320px;break-inside:avoid}.totals p{display:flex;justify-content:space-between;gap:25px}.grand{border-top:2px solid #304c38;padding-top:12px;font-size:19px}.conditions h2{font-size:14px}.conditions{margin-top:30px;font-size:12px}td:nth-child(2){overflow-wrap:anywhere}table{font-size:12px}.offer-photo{display:block;width:30mm;height:22mm;object-fit:cover;margin-bottom:8px}.line-description{margin-top:5px;font-size:11px;color:#58675f}`,
  );
}
