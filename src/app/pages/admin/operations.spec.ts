import { TestBed } from '@angular/core/testing';
import { OperationsComponent } from './operations.component';
import { AdminApiService } from '../../services/admin-api.service';
import seed from '../../data/initial-content.json';
import { SiteContent } from '../../models/content';
import { basePrice, offerTotals, shiftMinutes } from '../../models/operations';
import { labelsDocument, offerDocument } from './operations-print';

describe('Business operations', () => {
  let component: OperationsComponent;
  it('mixes editable catalog snapshots and manual items with optional print photos', () => {
    component.addOffer();
    const product = component.site.products.find(p => p.image)!;
    component.offerProductId = product.id;
    component.addLine();
    component.addLine(true);
    const [catalog, manual] = component.offer!.lines;
    expect(catalog.image).toBe(product.image);
    expect(catalog.description).toBe(product.description);
    expect(manual.image).toBe('');
    catalog.name = 'Customized plate';
    catalog.description = '<img src=x onerror=alert(1)>';
    expect(product.name).not.toBe(catalog.name);
    component.offer!.number = 'ANG-TEST';
    component.offer!.customer = 'Customer';
    component.offer!.lines.forEach(l => l.taxRate = 0);
    let doc = new DOMParser().parseFromString(offerDocument(component.offer!, ''), 'text/html');
    expect(doc.querySelectorAll('.offer-photo').length).toBe(1);
    expect(doc.querySelector('[onerror]')).toBeNull();
    component.offer!.showImages = false;
    doc = new DOMParser().parseFromString(offerDocument(component.offer!, ''), 'text/html');
    expect(doc.querySelectorAll('img').length).toBe(0);
    expect(catalog.image).toBe(product.image);
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AdminApiService, useValue: {} }],
    });
    component = TestBed.runInInjectionContext(() => new OperationsComponent());
    component.site = structuredClone(seed) as SiteContent;
    component.data = { labels: [], offers: [], employees: [], shifts: [] };
  });
  it('matches the supplied catering workbook amounts without inventing taxes', () => {
    component.addOffer(true);
    expect(offerTotals(component.offer!).gross).toBe(84291);
    expect(offerTotals(component.offer!).complete).toBeFalse();
    component.offer!.lines.forEach((l) => (l.taxRate = 19));
    const totals = offerTotals(component.offer!);
    expect(
      totals.net + totals.taxes.reduce((sum, [, tax]) => sum + tax, 0),
    ).toBe(totals.gross);
    component.offer!.priceMode = 'net';
    expect(offerTotals(component.offer!).net).toBe(84291);
  });
  it('converts packaged and 100g prices to a kilogram price', () => {
    component.addLabel(true);
    expect(basePrice(component.label!)).toBe(3200);
    component.label!.priceBasis = '100g';
    component.label!.priceCents = 280;
    expect(basePrice(component.label!)).toBe(2800);
    component.label!.priceBasis = 'piece';
    expect(basePrice(component.label!)).toBeNull();
  });
  it('paginates A4 labels and escapes user text instead of executing HTML', () => {
    component.addLabel(true);
    component.label!.name = '<script>alert(1)</script>';
    const html = labelsDocument(
      Array(25).fill(component.label),
      component.printSettings,
      {},
    );
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.querySelectorAll('.paper').length).toBe(2);
    expect(doc.querySelectorAll('.label').length).toBe(25);
    expect(doc.querySelectorAll('script').length).toBe(0);
    expect(doc.querySelector('h2')!.textContent).toBe(component.label!.name);
    expect(() =>
      labelsDocument(
        [component.label!],
        { ...component.printSettings, width: 190, margin: 25 },
        {},
      ),
    ).toThrow();
  });
  it('keeps internal notes off customer documents and blocks incomplete offers', () => {
    component.addOffer(true);
    expect(() => offerDocument(component.offer!, '')).toThrow();
    component.offer!.number = 'ANG-2026-00001';
    component.offer!.customer = 'Example customer';
    component.offer!.lines.forEach((l) => (l.taxRate = 0));
    component.offer!.notes = 'Private internal note';
    const doc = offerDocument(component.offer!, '');
    expect(doc).not.toContain('Private internal note');
    expect(doc).toContain('842,91');
  });
  it('subtracts pauses and supports overnight shifts', () => {
    expect(
      shiftMinutes({
        id: 's',
        employeeId: 'e',
        start: '2026-11-18T22:00',
        end: '2026-11-19T06:00',
        breakMinutes: 30,
        kind: 'actual',
        note: '',
      }),
    ).toBe(450);
  });
  it('accounts for Berlin daylight-saving transitions', () => {
    const shift = {
      id: 's',
      employeeId: 'e',
      start: '2026-03-28T22:00',
      end: '2026-03-29T06:00',
      breakMinutes: 0,
      kind: 'actual' as const,
      note: '',
    };
    expect(shiftMinutes(shift)).toBe(420);
    expect(
      shiftMinutes({
        ...shift,
        start: '2026-10-24T22:00',
        end: '2026-10-25T06:00',
      }),
    ).toBe(540);
    expect(shiftMinutes({ ...shift, start: '2026-03-29T02:30' })).toBeNaN();
  });
  it('fits the sample package label without clipping at the default A4 size', async () => {
    component.addLabel(true);
    component.label!.bestBefore = '2027-01-20';
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      await new Promise<void>((resolve) => {
        frame.onload = () => resolve();
        frame.srcdoc = labelsDocument(
          [component.label!],
          component.printSettings,
          {
            logoImage: 'assets/mediteranno-logo.jpg',
            businessName: 'Mediterrano',
            street: 'Kirchstraße 2',
            postalCode: '79312',
            city: 'Emmendingen',
          },
        );
      });
      const label =
        frame.contentDocument!.querySelector<HTMLElement>('.label')!;
      expect(label.scrollHeight).toBeLessThanOrEqual(label.clientHeight + 1);
      expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
    } finally {
      frame.remove();
    }
  });
});

describe('Operations editor lifecycle', () => {
  it('retains unsaved labels across tabs and reloads saved data', async () => {
    let persisted = {
      revision: 1,
      content: {
        labels: [],
        offers: [],
        employees: [],
        shifts: [],
      } as import('../../models/operations').Operations,
    };
    const api = {
      operations: async () => structuredClone(persisted),
      saveOperations: async (
        content: import('../../models/operations').Operations,
        revision: number,
      ) => {
        persisted = {
          revision: revision + 1,
          content: structuredClone(content),
        };
        return structuredClone(persisted);
      },
    };
    await TestBed.configureTestingModule({
      imports: [OperationsComponent],
      providers: [{ provide: AdminApiService, useValue: api }],
    }).compileComponents();
    const fixture = TestBed.createComponent(OperationsComponent);
    fixture.componentRef.setInput('site', structuredClone(seed));
    fixture.componentRef.setInput('tab', 'labels');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.addLabel(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mangoscheiben');
    fixture.componentRef.setInput('tab', 'offers');
    fixture.detectChanges();
    fixture.componentRef.setInput('tab', 'labels');
    fixture.detectChanges();
    expect(component.data!.labels.length).toBe(1);
    expect(component.dirty).toBeTrue();
    await component.save();
    await component.load();
    fixture.detectChanges();
    expect(component.data!.labels[0].priceCents).toBe(800);
    expect(component.dirty).toBeFalse();
    fixture.destroy();
  });
});
