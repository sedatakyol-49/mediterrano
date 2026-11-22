import { CommonModule } from '@angular/common';
import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { InquiryRevision } from '../../models/inquiry';

@Component({
  selector: 'app-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header>
      <div>
        <p class="eyebrow">Kundenservice</p>
        <h1>Kundenanfragen</h1>
        <p>Persönliche Zusammenstellungen von Ihrer Website.</p>
      </div>
      <button (click)="load()" [disabled]="busy">Aktualisieren</button>
    </header>
    <p *ngIf="error" role="alert" class="error">{{ error }}</p>
    <p *ngIf="notice" role="status">{{ notice }}</p>
    <p *ngIf="busy" role="status">Wird verarbeitet …</p>
    <div class="filters">
      <label
        >Suche<input
          type="search"
          [(ngModel)]="search"
          placeholder="Name, Referenz oder E-Mail" /></label
      ><label
        >Status<select [(ngModel)]="filter">
          <option value="">Alle Anfragen</option>
          <option *ngFor="let s of statuses" [value]="s.id">
            {{ s.title }}
          </option>
        </select></label
      >
    </div>
    <p *ngIf="!busy && !filtered.length">Keine passenden Anfragen vorhanden.</p>
    <div class="workspace">
      <div class="list">
        <button
          *ngFor="let row of filtered"
          (click)="select(row)"
          [class.active]="selected?.content?.id === row.content.id"
        >
          <small>{{ row.content.createdAt | date: 'dd.MM.yyyy · HH:mm' }}</small
          ><strong>{{ row.content.customer.name }}</strong
          ><span
            >{{ row.content.items.length }} Positionen ·
            {{ statusLabel(row.content.status) }}</span
          ><small>{{ row.content.id }}</small>
        </button>
      </div>
      <section *ngIf="selected as row" class="detail">
        <header>
          <div>
            <p class="eyebrow">{{ row.content.id }}</p>
            <h2>{{ row.content.customer.name }}</h2>
          </div>
          <span class="badge">{{ statusLabel(row.content.status) }}</span>
        </header>
        <dl>
          <dt>E-Mail</dt>
          <dd>
            <a [href]="'mailto:' + row.content.customer.email">{{
              row.content.customer.email
            }}</a>
          </dd>
          <dt>Telefon</dt>
          <dd>{{ row.content.customer.phone || 'Nicht angegeben' }}</dd>
          <dt>Veranstaltung</dt>
          <dd>
            {{ row.content.customer.eventDate || 'Offen' }} ·
            {{ row.content.guests || 'Offene Anzahl' }} Personen
          </dd>
          <dt>Ort / Adresse</dt>
          <dd>{{ row.content.customer.address || 'Offen' }}</dd>
        </dl>
        <h3>Wünsche</h3>
        <p class="multiline">
          {{
            row.content.customer.message || 'Keine weiteren Wünsche angegeben.'
          }}
        </p>
        <h3>Gewünschte Produkte</h3>
        <article *ngFor="let item of row.content.items">
          <img *ngIf="item.image" [src]="item.image" alt="" />
          <div>
            <strong>{{ item.quantity }} × {{ item.name }}</strong>
            <p>{{ item.description }}</p>
            <small
              >{{
                item.priceCents === null
                  ? 'Preis auf Anfrage'
                  : (item.priceCents / 100 | currency: 'EUR')
              }}
              ·
              {{
                item.priceMode === 'weight'
                  ? 'Gewicht / Portionen abstimmen'
                  : item.priceMode === 'person'
                    ? 'pro Person'
                    : 'Katalogpreis bei Anfrage'
              }}</small
            >
          </div>
        </article>
        <p class="hint">
          Wunschmengen und Katalogpreise sind noch kein verbindliches Angebot.
          Gewichte, Lieferung und Konditionen mit dem Kunden abstimmen.
        </p>
        <div class="email">
          <strong>E-Mail-Benachrichtigung</strong>
          <p>{{ mailLabel(row.content.emailStatus) }}</p>
          <button type="button" [disabled]="busy" (click)="resend()">
            {{
              row.content.emailStatus === 'accepted'
                ? 'Erneut senden'
                : 'Versand erneut versuchen'
            }}
          </button>
        </div>
        <form (ngSubmit)="save()">
          <fieldset [disabled]="busy">
            <label
              >Bearbeitungsstatus<select
                name="status"
                [(ngModel)]="status"
                (ngModelChange)="changed()"
              >
                <option *ngFor="let s of statuses" [value]="s.id">
                  {{ s.title }}
                </option>
              </select></label
            ><label
              >Interne Notizen<textarea
                name="notes"
                [(ngModel)]="notes"
                (ngModelChange)="changed()"
                maxlength="5000"
                rows="4"
              ></textarea></label
            ><button class="primary">Status & Notizen speichern</button>
          </fieldset>
        </form>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 20px;
      }
      h1 {
        font-size: 34px;
        margin: 8px 0;
      }
      h2 {
        font-size: 28px;
      }
      p {
        line-height: 1.6;
      }
      button,
      input,
      textarea,
      select {
        font: inherit;
        border: 1px solid #c6cdbf;
        border-radius: 4px;
        padding: 10px;
        background: white;
        color: #293e30;
      }
      button {
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.5;
      }
      label {
        display: block;
        font-size: 13px;
        margin-bottom: 16px;
      }
      input,
      select,
      textarea {
        display: block;
        width: 100%;
        margin-top: 6px;
      }
      .filters {
        display: flex;
        gap: 16px;
        margin: 24px 0;
      }
      .filters label:first-child {
        flex: 1;
      }
      .workspace {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        gap: 24px;
      }
      .list button {
        display: flex;
        flex-direction: column;
        gap: 7px;
        text-align: left;
        width: 100%;
        margin-bottom: 10px;
      }
      .list button.active {
        background: #e8eddf;
        border-color: #293e30;
      }
      .list small {
        font-size: 11px;
      }
      .list span {
        font-size: 12px;
      }
      .detail {
        background: #fff;
        border: 1px solid #d8ddcf;
        padding: 28px;
        min-width: 0;
      }
      dl {
        display: grid;
        grid-template-columns: 110px minmax(0, 1fr);
        gap: 12px;
        font-size: 14px;
      }
      dt {
        color: #727967;
      }
      dd {
        margin: 0;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      .multiline {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      article {
        display: flex;
        gap: 16px;
        border-bottom: 1px solid #e4e8dc;
        padding: 16px 0;
      }
      article img {
        width: 64px;
        height: 64px;
        object-fit: cover;
      }
      article p,
      article small,
      .hint {
        font-size: 12px;
        line-height: 1.6;
      }
      .badge {
        font-size: 11px;
        background: #e8eddf;
        padding: 8px;
        white-space: nowrap;
      }
      .email {
        padding: 18px;
        background: #f4f3eb;
        margin: 24px 0;
      }
      .email p {
        font-size: 13px;
      }
      fieldset {
        border: 0;
        padding: 0;
        min-width: 0;
      }
      .primary {
        background: #293e30;
        color: white;
      }
      .error {
        color: #a32424;
      }
      @media (max-width: 1000px) {
        .workspace {
          grid-template-columns: 1fr;
        }
        .list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
      }
      @media (max-width: 600px) {
        header,
        .filters {
          flex-direction: column;
        }
        .filters label {
          width: 100%;
        }
        .list {
          grid-template-columns: 1fr;
        }
        .detail {
          padding: 18px;
        }
        dl {
          grid-template-columns: 1fr;
          gap: 5px;
        }
        dd {
          margin-bottom: 10px;
        }
      }
    `,
  ],
})
export class InquiriesComponent implements OnChanges {
  private readonly api = inject(AdminApiService);
  items: InquiryRevision[] = [];
  selected: InquiryRevision | null = null;
  search = '';
  filter = '';
  busy = false;
  error = '';
  notice = '';
  status = 'new';
  notes = '';
  readonly statuses = [
    { id: 'new', title: 'Neu' },
    { id: 'contacted', title: 'In Bearbeitung' },
    { id: 'quoted', title: 'Angebot erstellt' },
    { id: 'closed', title: 'Abgeschlossen' },
  ];
  get filtered() {
    const q = this.search.toLocaleLowerCase('de');
    return this.items.filter(
      (r) =>
        (!this.filter || r.content.status === this.filter) &&
        [r.content.id, r.content.customer.name, r.content.customer.email]
          .join(' ')
          .toLocaleLowerCase('de')
          .includes(q),
    );
  }
  statusLabel(id: string) {
    return this.statuses.find((s) => s.id === id)?.title || id;
  }
  mailLabel(status: string) {
    return (
      (
        {
          pending: 'Versand wird vorbereitet.',
          not_configured:
            'SMTP ist noch nicht eingerichtet. Die Anfrage ist gespeichert.',
          accepted:
            'Vom Mailserver angenommen. Eine Zustellung im Posteingang kann nicht bestätigt werden.',
          failed: 'Versand fehlgeschlagen. Die Anfrage ist gespeichert.',
        } as Record<string, string>
      )[status] || status
    );
  }
  @Input() active = false;
  @Output() dirtyChange = new EventEmitter<boolean>();
  private loaded = false;
  get dirty() {
    return (
      !!this.selected &&
      (this.notes !== this.selected.content.notes ||
        this.status !== this.selected.content.status)
    );
  }
  changed() {
    this.dirtyChange.emit(this.dirty);
  }
  @HostListener('window:beforeunload', ['$event']) beforeUnload(
    event: BeforeUnloadEvent,
  ) {
    if (this.dirty) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
  ngOnChanges() {
    if (this.active && !this.loaded) {
      this.loaded = true;
      void this.load();
    }
  }
  select(row: InquiryRevision) {
    if (
      this.selected &&
      (this.notes !== this.selected.content.notes ||
        this.status !== this.selected.content.status) &&
      !window.confirm('Ungespeicherte Notizen verwerfen?')
    )
      return;
    this.selected = row;
    this.status = row.content.status;
    this.notes = row.content.notes;
    this.changed();
  }
  async load() {
    if (
      this.selected &&
      (this.notes !== this.selected.content.notes ||
        this.status !== this.selected.content.status) &&
      !window.confirm('Ungespeicherte Notizen verwerfen?')
    )
      return;
    await this.run(async () => {
      this.items = (await this.api.inquiries()).items;
      this.selected = null;
      if (this.items[0]) this.select(this.items[0]);
    });
  }
  async save() {
    if (!this.selected) return;
    const selected = this.selected;
    await this.run(async () => {
      const result = await this.api.updateInquiry(
        selected.content.id,
        selected.revision,
        this.status,
        this.notes,
      );
      this.replace(result);
      this.notice = 'Status und Notizen gespeichert.';
    });
  }
  async resend() {
    if (!this.selected) return;
    if (
      this.selected.content.emailStatus === 'accepted' &&
      !window.confirm(
        'Der Mailserver hat die erste Nachricht angenommen. Wirklich noch einmal senden?',
      )
    )
      return;
    await this.run(async () => {
      const result = await this.api.resendInquiry(this.selected!.content.id);
      this.items = this.items.map((r) =>
        r.content.id === result.content.id ? result : r,
      );
      this.selected = result;
      this.notice = 'Versandstatus aktualisiert.';
    });
  }
  private replace(row: InquiryRevision) {
    this.items = this.items.map((r) =>
      r.content.id === row.content.id ? row : r,
    );
    this.selected = null;
    this.select(row);
  }
  private async run(work: () => Promise<void>) {
    if (this.busy) return;
    this.busy = true;
    this.error = '';
    this.notice = '';
    try {
      await work();
    } catch (error: any) {
      this.error =
        error.error?.message || 'Anfragen konnten nicht verarbeitet werden.';
    } finally {
      this.busy = false;
    }
  }
}
