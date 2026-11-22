import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { QuoteRequestComponent } from './quote-request.component';
import { ContentService } from '../../services/content.service';

describe('Customer quote requests', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteRequestComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('sends product IDs and quantities, retains the retry key and offers WhatsApp only after storage', async () => {
    const fixture = TestBed.createComponent(QuoteRequestComponent);
    const c = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);
    const site = TestBed.inject(ContentService);
    site.content.update((value) => ({
      ...value,
      settings: { ...value.settings, whatsappNumber: '+491701234567' },
    }));
    const product = site.products()[0];
    c.add(product.id);
    c.add(product.id);
    c.name = 'Ada';
    c.email = 'ada@example.test';
    c.consent = true;
    const failed = c.submit();
    http.expectOne('/api/index.php?action=session').flush({ csrf: 'test' });
    await Promise.resolve();
    const first = http.expectOne('/api/index.php?action=request-offer');
    const key = first.request.body.requestKey;
    expect(first.request.headers.get('X-CSRF-Token')).toBe('test');
    expect(first.request.body.items).toEqual([
      { productId: product.id, quantity: 2 },
    ]);
    first.flush(
      { message: 'Offline' },
      { status: 503, statusText: 'Unavailable' },
    );
    await failed;
    expect(c.reference).toBe('');
    expect(c.whatsappUrl).toBe('');
    expect(c.selected.length).toBe(1);
    const retry = c.submit();
    http.expectOne('/api/index.php?action=session').flush({ csrf: 'next' });
    await Promise.resolve();
    const second = http.expectOne('/api/index.php?action=request-offer');
    expect(second.request.body.requestKey).toBe(key);
    second.flush({ id: 'inq-1234567890abcdef' });
    await retry;
    expect(c.whatsappUrl).toContain('https://wa.me/491701234567?text=');
    expect(decodeURIComponent(c.whatsappUrl)).toContain('2 × ' + product.name);
    await c.submit();
    http.expectNone('/api/index.php?action=session');
    fixture.destroy();
  });
  it('does not submit invalid quantities or an empty package', async () => {
    const fixture = TestBed.createComponent(QuoteRequestComponent);
    const c = fixture.componentInstance;
    await c.submit();
    expect(c.error).toBeTruthy();
    c.quantities[c.site.products()[0].id] = 1.5;
    await c.submit();
    expect(c.error).toBeTruthy();
    TestBed.inject(HttpTestingController).expectNone(
      '/api/index.php?action=session',
    );
    fixture.destroy();
  });
});
