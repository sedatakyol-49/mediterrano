import { ContentService } from '../../services/content.service';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly site = inject(ContentService);
  readonly settings = this.site.settings;
  private readonly http = inject(HttpClient);

  form = { name: '', email: '', message: '' };
  submitted = false;
  loading = false;
  errorMessage = '';
  mapEnabled = false;

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.submitted = false;
    this.errorMessage = '';

    this.http
      .post<{ success: boolean; message?: string }>('/contact.php', this.form)
      .subscribe({
        next: (response) => {
          this.loading = false;

          if (response?.success) {
            this.submitted = true;
            this.form = { name: '', email: '', message: '' };
            return;
          }

          this.errorMessage =
            response?.message || 'Die Nachricht konnte nicht gesendet werden.';
        },
        error: () => {
          this.loading = false;
          this.errorMessage =
            'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.';
        },
      });
  }

  enableMap(): void {
    this.mapEnabled = true;
  }
}
