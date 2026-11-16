import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService } from './content.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly site = inject(ContentService);
  private readonly path = signal(this.router.url);
  private readonly baseUrl = 'https://mediterrano-em.de';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.path.set(this.router.url));
    effect(() => this.update());
  }

  private update(): void {
    const path = this.path().split(/[?#]/)[0];
    const page = this.site
      .content()
      .pages.find((page) => page.id === (path.slice(1) || 'home'));
    const settings = this.site.settings();
    const privatePage = path.startsWith('/admin') || this.site.preview();
    const title = privatePage
      ? 'Verwaltung | ' + settings['businessName']
      : (page?.title ?? settings['businessName']);
    const description = page?.description ?? '';
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'robots',
      content: privatePage ? 'noindex,nofollow' : 'index,follow',
    });
    const canonical = this.baseUrl + (path === '/' ? '' : path);
    for (const [property, content] of Object.entries({
      'og:title': title,
      'og:description': description,
      'og:url': canonical,
      'og:type': 'website',
      'og:image': settings['heroImage']
        ? this.baseUrl + '/' + settings['heroImage']
        : '',
    })) {
      this.meta.updateTag({ property, content });
    }
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({
      name: 'twitter:image',
      content: settings['heroImage']
        ? this.baseUrl + '/' + settings['heroImage']
        : '',
    });
    let link = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = canonical;
    let schema = this.document.getElementById(
      'local-business-schema',
    ) as HTMLScriptElement | null;
    if (privatePage) {
      schema?.remove();
      return;
    }
    if (!schema) {
      schema = this.document.createElement('script');
      schema.id = 'local-business-schema';
      schema.type = 'application/ld+json';
      this.document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': ['Restaurant', 'CafeOrCoffeeShop'],
      name: settings['businessName'],
      url: this.baseUrl,
      telephone: settings['phone'],
      email: settings['email'],
      image: settings['heroImage']
        ? this.baseUrl + '/' + settings['heroImage']
        : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings['street'],
        postalCode: settings['postalCode'],
        addressLocality: settings['city'],
        addressCountry: 'DE',
      },
      sameAs: [
        settings['facebookUrl'],
        settings['instagramUrl'],
        settings['tiktokUrl'],
      ].filter(Boolean),
    });
  }
}
