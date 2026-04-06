import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ImpressumComponent } from './pages/impressum/impressum.component';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz.component';
import { AgbComponent } from './pages/agb/agb.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Mediterrano Emmendingen | Feinkost, Café, Antipasti',
    data: {
      seo: {
        title: 'Mediterrano Emmendingen | Feinkost, Café, Antipasti',
        description:
          'Mediterrano in Emmendingen bietet Feinkost, Antipasti, mediterrane Spezialitäten, Café und frisch zubereitete Produkte in zentraler Lage.',
        keywords:
          'Mediterrano Emmendingen, Feinkost Emmendingen, Antipasti Emmendingen, mediterrane Spezialitäten Emmendingen, Café Emmendingen'
      }
    }
  },
  {
    path: 'produkte',
    component: ProductsComponent,
    title: 'Produkte | Mediterrano Emmendingen',
    data: {
      seo: {
        title: 'Produkte | Mediterrano Emmendingen',
        description:
          'Produkte von Mediterrano in Emmendingen: Feinkost, Antipasti, Aufstriche, Oliven und mediterrane Spezialitäten.',
        keywords:
          'Produkte Mediterrano Emmendingen, Feinkost Emmendingen, Antipasti Emmendingen, Oliven Emmendingen, mediterrane Spezialitäten Emmendingen'
      }
    }
  },
  {
    path: 'ueber-uns',
    component: AboutComponent,
    title: 'Über Mediterrano in Emmendingen',
    data: {
      seo: {
        title: 'Über Mediterrano in Emmendingen',
        description:
          'Mehr über Mediterrano in Emmendingen: Familienbetrieb, Branchenerfahrung, mediterrane Spezialitäten und regionale Partner.',
        keywords:
          'Mediterrano Emmendingen, Feinkostladen Emmendingen, mediterrane Spezialitäten Emmendingen'
      }
    }
  },
  {
    path: 'kontakt',
    component: ContactComponent,
    title: 'Kontakt & Anfahrt | Mediterrano Emmendingen',
    data: {
      seo: {
        title: 'Kontakt & Anfahrt | Mediterrano Emmendingen',
        description:
          'Kontakt, Öffnungszeiten, Telefonnummer und Anfahrt zu Mediterrano in der Kirchstr. 2, 79312 Emmendingen.',
        keywords: 'Kontakt Mediterrano Emmendingen, Anfahrt Mediterrano, Öffnungszeiten Emmendingen Café'
      }
    }
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
    title: 'Impressum | Mediterrano',
    data: {
      seo: {
        title: 'Impressum | Mediterrano',
        description: 'Impressum von Mediterrano in Emmendingen.',
        keywords: 'Impressum Mediterrano'
      }
    }
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent,
    title: 'Datenschutz | Mediterrano',
    data: {
      seo: {
        title: 'Datenschutz | Mediterrano',
        description: 'Datenschutzhinweise von Mediterrano in Emmendingen.',
        keywords: 'Datenschutz Mediterrano'
      }
    }
  },
  {
    path: 'agb',
    component: AgbComponent,
    title: 'AGB | Mediterrano',
    data: {
      seo: {
        title: 'AGB | Mediterrano',
        description: 'Allgemeine Geschäftsbedingungen von Mediterrano.',
        keywords: 'AGB Mediterrano'
      }
    }
  },
  { path: '**', redirectTo: '' }
];
