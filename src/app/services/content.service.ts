import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import initialContent from '../data/initial-content.json';
import { ContentRevision, SiteContent, priceLabel } from '../models/content';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  readonly content = signal(initialContent as SiteContent);
  readonly unavailable = signal(false);
  readonly preview = signal(false);
  readonly settings = computed(() => this.content().settings);
  readonly products = computed(() => {
    const content = this.content();
    const categories = content.categories.filter(
      (category) => category.visible,
    );
    return content.products
      .filter(
        (product) =>
          product.visible &&
          categories.some((category) => category.id === product.categoryId),
      )
      .map((product) => ({
        ...product,
        price: priceLabel(product),
        category: categories.find(
          (category) => category.id === product.categoryId,
        )!.title,
      }));
  });
  readonly categories = computed(() =>
    this.content()
      .categories.filter((category) => category.visible)
      .map((category) => {
        const items = this.products().filter(
          (product) => product.categoryId === category.id,
        );
        return {
          ...category,
          items,
          photographed: items.filter((item) => item.image),
          remaining: items.filter((item) => !item.image),
        };
      }),
  );
  readonly mapsUrl = computed(
    () =>
      'https://maps.google.com/?q=' +
      encodeURIComponent(
        `${this.settings()['street']}, ${this.settings()['postalCode']} ${this.settings()['city']}`,
      ),
  );
  readonly phoneUrl = computed(
    () => 'tel:' + this.settings()['phone'].replace(/[^+\d]/g, ''),
  );

  async load(): Promise<void> {
    const preview =
      new URLSearchParams(window.location.search).get('preview') === '1';
    try {
      const result = await firstValueFrom(
        this.http
          .get<ContentRevision>(
            `/api/index.php?action=${preview ? 'draft' : 'content'}`,
          )
          .pipe(timeout(8000)),
      );
      if (
        !Array.isArray(result.content?.products) ||
        !Array.isArray(result.content?.pages)
      )
        throw new Error('Invalid content response');
      this.content.set(result.content);
      this.preview.set(preview);
      this.unavailable.set(false);
    } catch {
      this.unavailable.set(true);
      this.preview.set(false);
    }
  }
}
