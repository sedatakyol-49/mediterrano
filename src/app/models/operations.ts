export interface LabelRecord {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  layout: 'package' | 'counter' | 'detail';
  priceCents: number | null;
  quantity: number | null;
  unit: 'g' | 'ml' | 'Stück';
  priceBasis: 'package' | '100g' | '100ml' | 'piece';
  bestBefore: string;
  batch: string;
  ingredients: string;
  allergens: string;
  storage: string;
  nutrition: string;
  origin: string;
  image: string;
}
export interface OfferLine {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCents: number;
  taxRate: number | null;
  description?: string;
  image?: string;
}
export interface Offer {
  id: string;
  number: string;
  title: string;
  customer: string;
  address: string;
  email: string;
  date: string;
  validUntil: string;
  eventDate: string;
  guests: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'archived';
  priceMode: 'gross' | 'net';
  showImages?: boolean;
  introduction: string;
  terms: string;
  notes: string;
  company: string;
  companyAddress: string;
  companyContact: string;
  lines: OfferLine[];
}
export interface Employee {
  id: string;
  name: string;
  role: string;
  weeklyHours: number;
  active: boolean;
}
export interface Shift {
  id: string;
  employeeId: string;
  start: string;
  end: string;
  breakMinutes: number;
  kind: 'planned' | 'actual';
  note: string;
}
export interface Operations {
  labels: LabelRecord[];
  offers: Offer[];
  employees: Employee[];
  shifts: Shift[];
}
export interface OperationsRevision {
  revision: number;
  content: Operations;
}
export function offerTotals(offer: Offer) {
  let net = 0,
    gross = 0;
  const taxes = new Map<number, number>();
  for (const line of offer.lines) {
    const amount = Math.round(line.quantity * line.unitCents);
    const rate = line.taxRate ?? 0;
    const lineNet =
      offer.priceMode === 'net'
        ? amount
        : Math.round((amount * 100) / (100 + rate));
    const lineGross =
      offer.priceMode === 'gross'
        ? amount
        : lineNet + Math.round((lineNet * rate) / 100);
    net += lineNet;
    gross += lineGross;
    taxes.set(rate, (taxes.get(rate) ?? 0) + lineGross - lineNet);
  }
  return {
    net,
    gross,
    taxes: [...taxes].sort(([a], [b]) => a - b),
    complete: offer.lines.every((l) => l.taxRate !== null),
  };
}
export function shiftMinutes(shift: Shift): number {
  const duration = (berlinTime(shift.end) - berlinTime(shift.start)) / 60000;
  return Number.isFinite(duration) ? duration - shift.breakMinutes : NaN;
}
function berlinTime(value: string): number {
  const target = Date.parse(value + 'Z');
  if (!Number.isFinite(target)) return NaN;
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  let candidate = target;
  for (let i = 0; i < 3; i++) {
    const local = formatter.format(new Date(candidate)).replace(' ', 'T');
    if (local === value) return candidate;
    candidate += target - Date.parse(local + 'Z');
  }
  return NaN;
}
export function basePrice(label: LabelRecord): number | null {
  if (label.priceCents === null) return null;
  if (label.priceBasis === '100g' || label.priceBasis === '100ml')
    return label.priceCents * 10;
  if (
    label.priceBasis === 'package' &&
    label.quantity &&
    label.unit !== 'Stück'
  )
    return Math.round((label.priceCents * 1000) / label.quantity);
  return null;
}
