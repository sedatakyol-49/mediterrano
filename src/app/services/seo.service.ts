import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

type SeoData = {
  title?: string;
  description?: string;
  keywords?: string;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly baseUrl = 'https://mediterrano-em.de';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.applyRouteSeo());

    this.applyRouteSeo();
  }

  private applyRouteSeo(): void {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const seo = (route.snapshot.data['seo'] ?? {}) as SeoData;
    const pageTitle = seo.title ?? 'Mediterrano Emmendingen';
    const description =
      seo.description ??
      'Mediterrano in Emmendingen bietet Feinkost, Antipasti, mediterrane Spezialitäten und Café.';
    const keywords = seo.keywords ?? 'Mediterrano Emmendingen';
    const canonicalUrl = this.buildCanonicalUrl();

    this.title.setTitle(pageTitle);
    this.updateTag('name', 'description', description);
    this.updateTag('name', 'keywords', keywords);
    this.updateTag('name', 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    this.updateTag('property', 'og:title', pageTitle);
    this.updateTag('property', 'og:description', description);
    this.updateTag('property', 'og:url', canonicalUrl);
    this.updateTag('property', 'og:image', `${this.baseUrl}/assets/mediteranno-logo.jpg`);
    this.updateTag('property', 'og:type', 'website');
    this.updateTag('name', 'twitter:title', pageTitle);
    this.updateTag('name', 'twitter:description', description);
    this.updateTag('name', 'twitter:image', `${this.baseUrl}/assets/mediteranno-logo.jpg`);
    this.updateCanonical(canonicalUrl);
    this.updateLocalBusinessSchema();
  }

  private buildCanonicalUrl(): string {
    const path = this.router.url === '/' ? '' : this.router.url;
    return `${this.baseUrl}${path}`;
  }

  private updateTag(attribute: 'name' | 'property', value: string, content: string): void {
    this.meta.updateTag({ [attribute]: value, content });
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private updateLocalBusinessSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': ['Restaurant', 'CafeOrCoffeeShop'],
      name: 'Mediterrano',
      url: this.baseUrl,
      image: `${this.baseUrl}/assets/mediteranno-logo.jpg`,
      description:
        'Mediterrano in Emmendingen bietet Feinkost, Antipasti, mediterrane Spezialitäten, Café und frisch zubereitete Produkte.',
      telephone: '07641 9621359',
      email: 'info@mediterrano-em.de',
      priceRange: 'EUR',
      servesCuisine: ['Mediterranean', 'Turkish', 'Cafe', 'Deli'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kirchstr. 2',
        addressLocality: 'Emmendingen',
        postalCode: '79312',
        addressCountry: 'DE'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '48.120',
        longitude: '7.852'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '19:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '09:00',
          closes: '18:00'
        }
      ],
      sameAs: [
        'https://facebook.com/mediterrano.freiburg',
        'https://www.instagram.com/mediterrano.em?igsh=MXJ0M3IzODJtdWNlMQ%3D%3D&utm_source=qr',
        'https://tiktok.com/@mediterrano.freiburg'
      ]
    };

    let script = this.document.getElementById('local-business-schema') as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'local-business-schema';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }
}
