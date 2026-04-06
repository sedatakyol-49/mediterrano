import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ImpressumComponent } from './pages/impressum/impressum.component';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz.component';
import { AgbComponent } from './pages/agb/agb.component';
import { MittagsMenueComponent } from './pages/mittags-menue/mittags-menue.component';
import { FruehstuecksmenueComponent } from './pages/fruehstuecksmenue/fruehstuecksmenue.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Mediterrano Emmendingen | Frühstück, Mittagsmenü, Feinkost',
    data: {
      seo: {
        title: 'Mediterrano Emmendingen | Frühstück, Mittagsmenü, Feinkost',
        description:
          'Mediterrano in Emmendingen bietet mediterranes Frühstück, Mittagsmenüs, Antipasti, Bowls, Feinkost und frisch gepresste Säfte in zentraler Lage.',
        keywords:
          'Mediterrano Emmendingen, Frühstück Emmendingen, Mittagsmenü Emmendingen, Feinkost Emmendingen, Antipasti Emmendingen, mediterranes Café Emmendingen'
      }
    }
  },
  {
    path: 'mittags-menue',
    component: MittagsMenueComponent,
    title: 'Mittagsmenü in Emmendingen | Mediterrano',
    data: {
      seo: {
        title: 'Mittagsmenü in Emmendingen | Mediterrano',
        description:
          'Täglich frische Mittagsgerichte in Emmendingen: Bowls, Suppen, Antipasti-Teller, Sandwiches und frische Säfte bei Mediterrano.',
        keywords:
          'Mittagsmenü Emmendingen, Mittagessen Emmendingen, Bowl Emmendingen, Suppe Emmendingen, Antipasti Emmendingen'
      }
    }
  },
  {
    path: 'fruehstuecksmenue',
    component: FruehstuecksmenueComponent,
    title: 'Frühstück in Emmendingen | Mediterrano',
    data: {
      seo: {
        title: 'Frühstück in Emmendingen | Mediterrano',
        description:
          'Mediterranes und türkisches Frühstück in Emmendingen mit Simit, Menemen, Börek, Aufstrichen, Çay und frisch gepressten Säften.',
        keywords:
          'Frühstück Emmendingen, Brunch Emmendingen, türkisches Frühstück Emmendingen, Café Emmendingen, Simit Emmendingen'
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
          'Mehr über Mediterrano in Emmendingen: Familienbetrieb, mediterrane Spezialitäten, regionale Partner und frische hausgemachte Produkte.',
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
