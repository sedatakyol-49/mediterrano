import { Injectable, signal } from '@angular/core';
import { MenuCategory } from '../models/menu';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly categoriesSignal = signal<MenuCategory[]>([
    {
      id: 'mittags-menue',
      title: 'Mittags Menü',
      description: 'Täglich wechselnde Mittagsgerichte.',
      icon: 'lunch_dining',
      items: [
        { id: 'mittagstisch', name: 'Mittagstisch', description: 'Wechselndes Menü zur Mittagszeit.', icon: 'lunch_dining', accentColor: '#d69f5f', imageUrl: 'assets/aufstrichteller.jpg' },
        { id: 'antipasti-teller', name: 'Antipasti Teller', description: 'Auswahl mediterraner Vorspeisen mit Hummus, Feta, Oliven und gegrilltem Gemüse', icon: 'restaurant_menu', accentColor: '#2f7d69', imageUrl: 'assets/aufstrichteller.jpg' },
        { id: 'antipasti-sandwich', name: 'Antipasti Sandwich', description: 'Mediterranes Sandwich mit Antipasti-Zutaten', icon: 'lunch_dining', accentColor: '#b83e3e', imageUrl: 'assets/hamburger-aufstrich.jpg'},
        { id: 'fruehstueck-teller', name: 'Frühstück Teller', description: 'Gegrilltes Simit, Ei und frisches Gemüse', icon: 'brunch_dining', accentColor: '#d69f5f',  imageUrl: 'assets/aufstrichteller.jpg' },
        { id: 'toast', name: 'Toast', description: 'Gebratene Sandwiches mit Beilagen', icon: 'bakery_dining', accentColor: '#d69f5f',  imageUrl: 'assets/toast.jpg' },
        { id: 'reis-gemuese', name: 'Reis mit Gemüse', description: 'Herzhafte Gemüsepfanne mit Reis', icon: 'rice_bowl', accentColor: '#2f7d69', imageUrl: 'assets/aufstrichteller.jpg' },
        { id: 'bowl-vegetarisch', name: 'Bowl Vegetarisch', description: 'Bunte Bowl mit Kichererbsen, Grünzeug, Mais, Tomaten', icon: 'eco', accentColor: '#2f7d69', tags: ['vegan'], imageUrl: 'assets/bowl.jpg' },
        { id: 'bowl-haehnchen', name: 'Bowl mit Hähnchen', description: 'Bunte Bowl mit Hähnchen, Kichererbsen, Grünzeug, Mais, Tomaten', icon: 'restaurant', accentColor: '#b83e3e', imageUrl: 'assets/aufstrichteller.jpg' },
        { id: 'linsensuppe', name: 'Linsensuppe', description: 'Würzige Linsensuppe', icon: 'soup_kitchen', accentColor: '#b83e3e', tags: ['vegan'],  imageUrl: 'assets/aufstrichteller.jpg'},
        { id: 'gemuesesuppe', name: 'Gemüsesuppe', description: 'Frische Gemüsesuppe', icon: 'soup_kitchen', accentColor: '#2f7d69', tags: ['vegan'],  imageUrl: 'assets/aufstrichteller.jpg' },
        { id: 'fruchtsaefte', name: 'Frisch Gepresste Fruchtsäfte', description: 'Auswahl verschiedener frisch gepresster Säfte', icon: 'local_drink', accentColor: '#b83e3e',  imageUrl: 'assets/aufstrichteller.jpg' }
      ]
    },
    {
      id: 'fruehstueck',
      title: 'Mediterrano Frühstücksmenü',
      description: '„Frühstücken wie im Urlaub – täglich bei uns."',
      icon: 'brunch_dining',
      items: [
        { id: 'klassisch-mediterran', name: 'Klassisch Mediterran', description: 'Joghurt mit Honig, Walnüssen & Haferflocken, Frischer Obstteller (saisonal), Kräuteromelette oder gekochtes Ei, Frisch gepresster Saft', icon: 'brunch_dining', accentColor: '#d69f5f', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop' },
        { id: 'tuerkisches-genussfruehstueck', name: 'Türkisches Genussfrühstück', description: 'Simit & frisch gebackenes Fladenbrot, Käsevielfalt (Beyaz Peynir, Kaşar, Feta), Oliven, Tomaten, Gurken, Paprika, Verschiedene hausgemachte Dips & Marmeladen, Honig mit Kaymak, Börek & Sigara-Böreği, Menemen oder Sucuklu Yumurta (nach Wahl), Baklava zum Abschluss, Unbegrenzt Çay', icon: 'brunch_dining', accentColor: '#2f7d69', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop' },
        { id: 'leicht-vital', name: 'Leicht & Vital', description: 'Simit mit geschmolzenem Käse gefüllt, Spiegelei in der Mitte gebacken, Tomaten- & Kräuterbeilage, Wahlweise mit Sucuk (+1,50 €), Ayran, Çay oder frisch gepresster Saft nach Wahl', icon: 'eco', accentColor: '#2f7d69', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop' },
        { id: 'simit-toast-spezial', name: 'Simit-Toast Spezial', description: 'Börek (wahlweise mit Spinat-Feta oder Hackfleisch), Menemen (Eiergericht mit Tomaten, Paprika & Kräutern), Schafskäse mit Gurken & Tomaten, Türkischer Mokka oder Çay', icon: 'bakery_dining', accentColor: '#d69f5f', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
        { id: 'serpme-kahvalti', name: 'Wochenend-Spezial: Serpme Kahvaltı', description: 'Samstags mit Reservierung', icon: 'event', accentColor: '#b83e3e', tags: ['Samstags mit Reservierung'], imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop' },
        { id: 'suesser-abschluss', name: 'Süßer Abschluss', description: 'Kleine Auswahl an Baklava & Lokum, Türkischer Kaffee, Schwarzer Tee, Türkischer Apfeltee oder Minztee', icon: 'bakery_dining', accentColor: '#d69f5f', imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'fruehstueck-extras',
      title: 'Frühstück Extras',
      description: 'Zusätzliche Optionen für Ihr Frühstück.',
      icon: 'add_circle',
     items: [
        { id: 'extra-sucuk', name: 'Extra Sucuk', icon: 'restaurant', accentColor: '#b83e3e', imageUrl: 'assets/toast.jpg' },
        { id: 'extra-simit', name: 'Extra Simit', icon: 'bakery_dining', accentColor: '#d69f5f', imageUrl: 'assets/toast.jpg' },
        { id: 'extra-boerek', name: 'Extra Börek (2 Stück)', icon: 'bakery_dining', accentColor: '#d69f5f', imageUrl: 'assets/toast.jpg' },
        { id: 'extra-dips', name: 'Extra Dips (nach Tagesauswahl)', icon: 'restaurant', accentColor: '#2f7d69', imageUrl: 'assets/toast.jpg' },
        { id: 'extra-kaese', name: 'Extra Käseportion', icon: 'local_pizza', accentColor: '#d69f5f', imageUrl: 'assets/toast.jpg' },
        { id: 'extra-saft', name: 'Glas frisch gepresster Saft', icon: 'local_drink', accentColor: '#b83e3e', imageUrl: 'assets/toast.jpg' },
        { id: 'extra-kaffee', name: 'Türkischer Kaffee', icon: 'local_cafe', accentColor: '#6b4f3a', imageUrl: 'assets/toast.jpg' }
]
    }
  ]);

  getCategories() {
    return this.categoriesSignal.asReadonly();
  }
} 