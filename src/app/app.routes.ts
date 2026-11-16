import { ContentPageComponent } from './pages/content-page/content-page.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(
        (module) => module.AdminComponent,
      ),
    title: 'Verwaltung | Mediterrano',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Mediterrano Emmendingen | Feinkost, Cafe, Antipasti',
    data: {
      seo: {
        title: 'Mediterrano Emmendingen | Feinkost, Cafe, Antipasti',
        description:
          'Mediterrano in Emmendingen bietet Feinkost, Antipasti, mediterrane Spezialitaeten, Cafe und frisch zubereitete Produkte in zentraler Lage.',
        keywords:
          'Mediterrano Emmendingen, Feinkost Emmendingen, Antipasti Emmendingen, mediterrane Spezialitaeten Emmendingen, Cafe Emmendingen',
      },
    },
  },
  {
    path: 'produkte',
    component: ProductsComponent,
    title: 'Produkte | Mediterrano Emmendingen',
    data: {
      seo: {
        title: 'Produkte | Mediterrano Emmendingen',
        description:
          'Produkte von Mediterrano in Emmendingen: Feinkost, Antipasti, Aufstriche, Oliven und mediterrane Spezialitaeten.',
        keywords:
          'Produkte Mediterrano Emmendingen, Feinkost Emmendingen, Antipasti Emmendingen, Oliven Emmendingen, mediterrane Spezialitaeten Emmendingen',
      },
    },
  },
  {
    path: 'ueber-uns',
    component: ContentPageComponent,
    title: 'Ueber Mediterrano in Emmendingen',
    data: {
      pageId: 'ueber-uns',
      seo: {
        title: 'Ueber Mediterrano in Emmendingen',
        description:
          'Mehr ueber Mediterrano in Emmendingen: Familienbetrieb seit August 2025, Feinkost, Cafe und mediterrane Spezialitaeten.',
        keywords:
          'Mediterrano Emmendingen, Feinkostladen Emmendingen, mediterrane Spezialitaeten Emmendingen',
      },
    },
  },
  {
    path: 'kontakt',
    component: ContactComponent,
    title: 'Kontakt & Anfahrt | Mediterrano Emmendingen',
    data: {
      seo: {
        title: 'Kontakt & Anfahrt | Mediterrano Emmendingen',
        description:
          'Kontakt, Oeffnungszeiten, Telefonnummer und Anfahrt zu Mediterrano in der Kirchstr. 2, 79312 Emmendingen.',
        keywords:
          'Kontakt Mediterrano Emmendingen, Anfahrt Mediterrano, Oeffnungszeiten Emmendingen Cafe',
      },
    },
  },
  {
    path: 'impressum',
    component: ContentPageComponent,
    title: 'Impressum | Mediterrano',
    data: {
      pageId: 'impressum',
      seo: {
        title: 'Impressum | Mediterrano',
        description: 'Impressum von Mediterrano in Emmendingen.',
        keywords: 'Impressum Mediterrano',
      },
    },
  },
  {
    path: 'datenschutz',
    component: ContentPageComponent,
    title: 'Datenschutz | Mediterrano',
    data: {
      pageId: 'datenschutz',
      seo: {
        title: 'Datenschutz | Mediterrano',
        description: 'Datenschutzhinweise von Mediterrano in Emmendingen.',
        keywords: 'Datenschutz Mediterrano',
      },
    },
  },
  {
    path: 'agb',
    component: ContentPageComponent,
    title: 'AGB | Mediterrano',
    data: {
      pageId: 'agb',
      seo: {
        title: 'AGB | Mediterrano',
        description: 'Allgemeine Geschaeftsbedingungen von Mediterrano.',
        keywords: 'AGB Mediterrano',
      },
    },
  },
  { path: '**', redirectTo: '' },
];
