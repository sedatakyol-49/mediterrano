import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContentService } from '../../services/content.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quote-request.component.html',
  styleUrl: './quote-request.component.scss',
})
export class QuoteRequestComponent {
  readonly site = inject(ContentService);
  private readonly http = inject(HttpClient);
  search = '';
  category = '';
  quantities: Record<string, number> = {};
  name = '';
  email = '';
  phone = '';
  eventDate = '';
  address = '';
  message = '';
  guests: number | null = null;
  consent = false;
  website = '';
  busy = false;
  error = '';
  reference = '';
  whatsappUrl = '';
  private readonly requestKey = Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    (v) => v.toString(16).padStart(2, '0'),
  ).join('');
  get products() {
    return this.site
      .products()
      .filter(
        (p) =>
          (!this.category || p.categoryId === this.category) &&
          p.name
            .toLocaleLowerCase('de')
            .includes(this.search.toLocaleLowerCase('de')),
      );
  }
  get selected() {
    return this.site.products().filter((p) => this.quantities[p.id] > 0);
  }
  showSelection() {
    document
      .getElementById('request-details')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  add(id: string) {
    this.quantities[id] = Math.min(1000, (this.quantities[id] || 0) + 1);
  }
  remove(id: string) {
    delete this.quantities[id];
  }
  async submit() {
    if (this.busy || this.reference) return;
    this.error = '';
    if (
      !this.selected.length ||
      this.selected.some(
        (p) =>
          !Number.isInteger(this.quantities[p.id]) ||
          this.quantities[p.id] < 1 ||
          this.quantities[p.id] > 1000,
      )
    ) {
      this.error = 'Bitte Produkte und gültige Mengen auswählen.';
      return;
    }
    this.busy = true;
    try {
      const session = await firstValueFrom(
        this.http.get<{ csrf: string }>('/api/index.php?action=session'),
      );
      const result = await firstValueFrom(
        this.http.post<{ id: string }>(
          '/api/index.php?action=request-offer',
          {
            requestKey: this.requestKey,
            name: this.name,
            email: this.email,
            phone: this.phone,
            eventDate: this.eventDate,
            address: this.address,
            message: this.message,
            guests: this.guests,
            consent: this.consent,
            website: this.website,
            items: this.selected.map((p) => ({
              productId: p.id,
              quantity: this.quantities[p.id],
            })),
          },
          { headers: { 'X-CSRF-Token': session.csrf } },
        ),
      );
      this.reference = result.id;
      const phone = this.site.whatsappNumber();
      if (phone)
        this.whatsappUrl =
          'https://wa.me/' +
          phone +
          '?text=' +
          encodeURIComponent(
            `Guten Tag! Ich habe eine Angebotsanfrage gestellt. Referenz: ${result.id}. Name: ${this.name}.\n` +
              this.selected
                .map((p) => `${this.quantities[p.id]} × ${p.name}`)
                .join('\n'),
          );
    } catch (error) {
      this.error =
        error instanceof HttpErrorResponse
          ? error.error?.message ||
            'Die Anfrage konnte nicht bestätigt werden. Bitte erneut versuchen; dieselbe Anfrage wird nicht doppelt gespeichert.'
          : 'Bitte erneut versuchen.';
    } finally {
      this.busy = false;
    }
  }
}
