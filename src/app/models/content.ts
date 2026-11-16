export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceMode: 'fixed' | 'person' | 'weight' | 'request';
  priceCents: number | null;
  image: string;
  imageAlt: string;
  visible: boolean;
  featured: boolean;
  deli: boolean;
  breakfast: boolean;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

export interface ContentPage {
  id: string;
  title: string;
  description: string;
  body: string;
}

export interface SiteContent {
  categories: Category[];
  products: Product[];
  settings: Record<string, string>;
  pages: ContentPage[];
}

export interface ContentRevision {
  revision: number;
  content: SiteContent;
}

export interface MediaItem {
  id: string;
  path: string;
  name: string;
  alt: string;
}

export interface AdminSession {
  user: { id: number; email: string } | null;
  csrf: string;
}

export function priceLabel(product: Product): string {
  if (product.priceMode === 'weight') return 'Preis nach Gewicht';
  if (product.priceMode === 'request' || product.priceCents === null) return '';
  const price = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.priceCents / 100);
  return product.priceMode === 'person' ? `${price} / Person` : price;
}
