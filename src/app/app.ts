import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ContentService } from './services/content.service';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from './services/seo.service';
import { FloatingContactComponent } from './components/floating-contact/floating-contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, FloatingContactComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly content = inject(ContentService);
  readonly router = inject(Router);
  get isAdmin(): boolean {
    return this.router.url.startsWith('/admin');
  }
  constructor(private readonly seoService: SeoService) {
    void this.seoService;
  }
}
