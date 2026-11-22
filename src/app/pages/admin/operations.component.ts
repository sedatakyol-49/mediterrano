import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { MediaItem, SiteContent } from '../../models/content';
import {
  LabelRecord,
  Offer,
  OfferLine,
  Operations,
  Shift,
  basePrice,
  offerTotals,
  shiftMinutes,
} from '../../models/operations';
import {
  LabelPrintSettings,
  euros,
  germanDate,
  labelsDocument,
  offerDocument,
  openPrintPreview,
} from './operations-print';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.scss',
})
export class OperationsComponent implements OnChanges {
  @Input() tab = '';
  @Input({ required: true }) site!: SiteContent;
  @Input() media: MediaItem[] = [];
  @Output() dirtyChange = new EventEmitter<boolean>();
  private api = inject(AdminApiService);
  data: Operations | null = null;
  revision = 0;
  busy = false;
  dirty = false;
  error = '';
  message = '';
  label: LabelRecord | null = null;
  offer: Offer | null = null;
  search = '';
  productId = '';
  offerProductId = '';
  copies: Record<string, number> = {};
  printSettings: LabelPrintSettings = {
    width: 70,
    height: 50,
    margin: 0,
    gap: 0,
    paper: 'a4',
  };
  month = this.today().slice(0, 7);
  employeeFilter = '';
  shiftKind = 'actual';
  readonly euros = euros;
  readonly basePrice = basePrice;
  readonly totals = offerTotals;
  readonly germanDate = germanDate;
  readonly statusLabels: Record<string, string> = {
    draft: 'Entwurf',
    sent: 'Versendet',
    accepted: 'Angenommen',
    declined: 'Abgelehnt',
    archived: 'Archiviert',
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tab']) this.search = '';
    if (this.active && !this.data && !this.busy) void this.load();
  }
  get active() {
    return ['labels', 'offers', 'team'].includes(this.tab);
  }
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  id() {
    return crypto.randomUUID();
  }
  markDirty() {
    this.dirty = true;
    this.dirtyChange.emit(true);
    this.message = '';
  }
  async run(action: () => Promise<void>) {
    if (this.busy) return;
    this.busy = true;
    this.error = '';
    this.message = '';
    try {
      await action();
    } catch (e: any) {
      this.error =
        e.error?.message ||
        e.message ||
        'Die Aktion konnte nicht abgeschlossen werden.';
    } finally {
      this.busy = false;
    }
  }
  async load() {
    if (
      this.dirty &&
      !window.confirm('Ungespeicherte Betriebsdaten verwerfen und neu laden?')
    )
      return;
    await this.run(async () => {
      const result = await this.api.operations();
      this.data = result.content;
      this.revision = result.revision;
      this.dirty = false;
      this.dirtyChange.emit(false);
      this.label = null;
      this.offer = null;
    });
  }
  async save() {
    if (!this.data) return;
    await this.run(async () => {
      const labelId = this.label?.id,
        offerId = this.offer?.id;
      const result = await this.api.saveOperations(this.data!, this.revision);
      this.data = result.content;
      this.revision = result.revision;
      this.label = this.data.labels.find((l) => l.id === labelId) ?? null;
      this.offer = this.data.offers.find((o) => o.id === offerId) ?? null;
      this.dirty = false;
      this.dirtyChange.emit(false);
      this.message = 'Betriebsdaten gespeichert.';
    });
  }
  exportData() {
    if (!this.data) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { revision: this.revision, content: this.data },
            null,
            2,
          ),
        ],
        { type: 'application/json' },
      ),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mediterrano-Betriebsdaten-${this.today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  get labels() {
    return (
      this.data?.labels.filter((l) =>
        l.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()),
      ) ?? []
    );
  }
  get offers() {
    return (
      this.data?.offers.filter((o) =>
        `${o.number} ${o.customer} ${o.title}`
          .toLocaleLowerCase()
          .includes(this.search.toLocaleLowerCase()),
      ) ?? []
    );
  }
  addLabel(example = false) {
    if (!this.data) return;
    const product = this.site.products.find((p) => p.id === this.productId);
    this.label = {
      id: this.id(),
      productId: product?.id ?? '',
      name: example ? 'Mangoscheiben' : (product?.name ?? 'Neues Etikett'),
      subtitle: '',
      layout: 'package',
      priceCents: example ? 800 : (product?.priceCents ?? null),
      quantity: example ? 250 : null,
      unit: 'g',
      priceBasis: 'package',
      bestBefore: '',
      batch: '',
      ingredients: '',
      allergens: '',
      storage: '',
      nutrition: '',
      origin: '',
      image: product?.image ?? '',
    };
    this.data.labels.unshift(this.label);
    this.copies[this.label.id] = 1;
    this.markDirty();
  }
  duplicateLabel() {
    if (!this.label || !this.data) return;
    this.label = {
      ...structuredClone(this.label),
      id: this.id(),
      name: this.label.name + ' – Kopie',
    };
    this.data.labels.unshift(this.label);
    this.markDirty();
  }
  removeLabel() {
    if (
      !this.data ||
      !this.label ||
      !window.confirm('Dieses Etikett aus der Sammlung entfernen?')
    )
      return;
    this.data.labels = this.data.labels.filter((l) => l.id !== this.label!.id);
    this.label = null;
    this.markDirty();
  }
  setLabelPrice(value: number | null) {
    if (this.label) {
      this.label.priceCents = value === null ? null : Math.round(value * 100);
      this.markDirty();
    }
  }
  syncLabel() {
    const product = this.site.products.find(
      (p) => p.id === this.label?.productId,
    );
    if (!product || !this.label) return;
    this.label.name = product.name;
    this.label.image = product.image;
    this.label.priceCents = product.priceCents;
    this.markDirty();
  }
  layoutPreset(value: string) {
    if (value === 'wide')
      this.printSettings = {
        width: 99,
        height: 38,
        margin: 5,
        gap: 2,
        paper: 'a4',
      };
    else if (value === 'detail')
      this.printSettings = {
        width: 190,
        height: 65,
        margin: 10,
        gap: 3,
        paper: 'a4',
      };
    else
      this.printSettings = {
        width: 70,
        height: value === 'small' ? 37 : 50,
        margin: 0,
        gap: 0,
        paper: 'a4',
      };
  }
  get selectedCopies() {
    return Object.values(this.copies).reduce(
      (a, b) => a + (Number.isFinite(b) ? b : 0),
      0,
    );
  }
  printLabels() {
    this.error = '';
    try {
      const labels: LabelRecord[] = [];
      for (const l of this.data?.labels ?? []) {
        const count = this.copies[l.id] ?? 0;
        if (!Number.isInteger(count) || count < 0 || count > 200)
          throw new Error(
            'Bitte ganze Stückzahlen zwischen 0 und 200 eingeben.',
          );
        if (count && l.priceCents === null)
          throw new Error(`Preis fehlt: ${l.name}`);
        if (labels.length + count > 200)
          throw new Error(
            'Bitte maximal 200 Etiketten pro Druckauftrag auswählen.',
          );
        for (let i = 0; i < count; i++) labels.push(l);
      }
      openPrintPreview(
        labelsDocument(labels, this.printSettings, this.site.settings),
      );
    } catch (e: any) {
      this.error = e.message;
    }
  }
  addOffer(sample = false) {
    if (!this.data) return;
    const s = this.site.settings;
    this.offer = {
      id: this.id(),
      number: '',
      title: 'Catering-Angebot',
      customer: '',
      address: '',
      email: '',
      date: this.today(),
      validUntil: '',
      eventDate: '',
      guests: sample ? 35 : 0,
      status: 'draft',
      priceMode: 'gross',
      showImages: true,
      introduction:
        'Vielen Dank für Ihre Anfrage. Gerne bieten wir Ihnen folgende Auswahl für Ihre Veranstaltung an.',
      terms: '',
      notes: '',
      company: s['businessName'],
      companyAddress: `${s['street']}\n${s['postalCode']} ${s['city']}`,
      companyContact: `${s['phone']} · ${s['email']}`,
      lines: [],
    };
    if (sample) {
      const rows: [string, number, number][] = [
        ['Antipasti Platte', 1, 25000],
        ['Börek Platte', 20, 300],
        ['Reis', 1, 4000],
        ['Gemüse', 35, 300],
        ['Manti', 9, 599],
        ['Salat', 6, 400],
        ['Hähnchenbrustfilet', 40, 200],
        ['Rindergulasch', 18, 1000],
        ['Lieferung', 1, 5000],
      ];
      this.offer.lines = rows.map(([name, quantity, unitCents]) => ({
        id: this.id(),
        name,
        quantity,
        unit: 'Einheit',
        unitCents,
        taxRate: null,
      }));
      this.offer.notes =
        'Aus Muster Angebot.xlsx übernommen. Einheiten, Mengen, Preise und Steuersätze vor Verwendung prüfen.';
    }
    this.data.offers.unshift(this.offer);
    this.markDirty();
  }
  addLine(manual = false) {
    if (!this.offer) return;
    const p = manual ? undefined : this.site.products.find((p) => p.id === this.offerProductId);
    this.offer.lines.push({
      id: this.id(),
      name: p?.name ?? 'Neue Position',
      description: p?.description ?? '',
      image: p?.image ?? '',
      quantity: 1,
      unit: p?.priceMode === 'person' ? 'Person' : 'Einheit',
      unitCents: p?.priceCents ?? 0,
      taxRate: null,
    });
    this.markDirty();
  }
  async uploadLineImage(line: OfferLine, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      this.error = 'Bitte JPG, PNG oder WebP bis 8 MB auswählen.';
      input.value = '';
      return;
    }
    await this.run(async () => {
      const result = await this.api.upload(file, line.name);
      this.media.unshift(result.item);
      line.image = result.item.path;
      this.markDirty();
      this.message = 'Foto hochgeladen. Bitte das Angebot speichern.';
    });
    input.value = '';
  }
  setLinePrice(line: OfferLine, value: number) {
    line.unitCents = Math.round(value * 100);
    this.markDirty();
  }
  removeLine(line: OfferLine) {
    if (!this.offer) return;
    this.offer.lines = this.offer.lines.filter((l) => l.id !== line.id);
    this.markDirty();
  }
  duplicateOffer() {
    if (!this.offer || !this.data) return;
    this.offer = {
      ...structuredClone(this.offer),
      id: this.id(),
      number: '',
      status: 'draft',
      date: this.today(),
    };
    this.data.offers.unshift(this.offer);
    this.markDirty();
  }
  printOffer() {
    try {
      if (this.offer)
        openPrintPreview(
          offerDocument(this.offer, this.site.settings['logoImage']),
        );
    } catch (e: any) {
      this.error = e.message;
    }
  }
  addEmployee() {
    this.data?.employees.push({
      id: this.id(),
      name: 'Neue Person',
      role: '',
      weeklyHours: 0,
      active: true,
    });
    this.markDirty();
  }
  addShift() {
    const person = this.data?.employees.find((e) => e.active);
    if (!person) {
      this.error = 'Bitte zuerst eine aktive Person anlegen.';
      return;
    }
    this.data?.shifts.unshift({
      id: this.id(),
      employeeId: person.id,
      start: this.today() + 'T09:00',
      end: this.today() + 'T17:00',
      breakMinutes: 30,
      kind: 'planned',
      note: '',
    });
    this.shiftKind = 'planned';
    this.month = this.today().slice(0, 7);
    this.employeeFilter = '';
    this.markDirty();
  }
  removeShift(shift: Shift) {
    if (!this.data || !window.confirm('Diesen Arbeitszeiteintrag entfernen?'))
      return;
    this.data.shifts = this.data.shifts.filter((s) => s.id !== shift.id);
    this.markDirty();
  }
  get shifts() {
    return (
      this.data?.shifts
        .filter(
          (s) =>
            s.start.startsWith(this.month) &&
            (!this.employeeFilter || s.employeeId === this.employeeFilter) &&
            s.kind === this.shiftKind,
        )
        .sort((a, b) => a.start.localeCompare(b.start)) ?? []
    );
  }
  hours(shift: Shift) {
    const minutes = shiftMinutes(shift);
    return Number.isFinite(minutes) && minutes >= 0
      ? (minutes / 60).toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : 'Ungültig';
  }
  get totalHours() {
    const values = this.shifts.map(shiftMinutes);
    return values.every((v) => Number.isFinite(v) && v >= 0)
      ? (values.reduce((a, b) => a + b, 0) / 60).toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '—';
  }
  exportHours() {
    const safe = (v: unknown) => {
      let t = String(v ?? '');
      if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
      return '"' + t.replaceAll('"', '""') + '"';
    };
    const rows = [
      ['Person', 'Beginn', 'Ende', 'Pause (Min.)', 'Stunden', 'Art', 'Notiz'],
      ...this.shifts.map((s) => [
        this.data?.employees.find((e) => e.id === s.employeeId)?.name,
        s.start,
        s.end,
        s.breakMinutes,
        this.hours(s),
        s.kind === 'actual' ? 'Ist' : 'Plan',
        s.note,
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        ['\uFEFF' + rows.map((r) => r.map(safe).join(';')).join('\r\n')],
        { type: 'text/csv;charset=utf-8' },
      ),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arbeitszeiten-${this.month}-${this.shiftKind}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
