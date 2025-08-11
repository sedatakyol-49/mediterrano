import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { ImpressumComponent } from './pages/impressum/impressum.component';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz.component';
import { AgbComponent } from './pages/agb/agb.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Mediterrano – Start' },
  { path: 'produkte', component: ProductsComponent, title: 'Unsere Produkte – Mediterrano' },
  { path: 'ueber-uns', component: AboutComponent, title: 'Über uns – Mediterrano' },
  { path: 'kontakt', component: ContactComponent, title: 'Kontakt – Mediterrano' },
  { path: 'impressum', component: ImpressumComponent, title: 'Impressum – Mediterrano' },
  { path: 'datenschutz', component: DatenschutzComponent, title: 'Datenschutz – Mediterrano' },
  { path: 'agb', component: AgbComponent, title: 'AGB – Mediterrano' },
  { path: '**', redirectTo: '' }
];
