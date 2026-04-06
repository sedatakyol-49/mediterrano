import { Injectable, signal } from '@angular/core';
import { MenuCategory } from '../models/menu';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly categoriesSignal = signal<MenuCategory[]>([
    {
      id: 'mittags-menue',
      title: 'Mittagsmenü',
      description: 'Warme Gerichte, Bowls, Teller und Sandwiches für eine frische Mittagspause in Emmendingen.',
      icon: 'lunch_dining',
      items: [
        {
          id: 'bowl-vegetarisch',
          name: 'Bowl Vegetarisch',
          description: 'Mit Reis oder Bulgur, Salat, Kichererbsen, Tomaten, Gurken, Mais, Oliven, Feta und roten Zwiebeln.',
          icon: 'eco',
          accentColor: '#2f7d69',
          tags: ['vegetarisch'],
          imageUrl: 'assets/mediterrano-gallery/mediterrano-010.jpeg',
          priceLabel: '10,50 EUR'
        },
        {
          id: 'bowl-haehnchen',
          name: 'Bowl mit Hähnchen',
          description: 'Mit Hähnchenbrustfilet, Reis oder Bulgur, Salat, Kichererbsen, Tomaten, Gurken, Mais und roten Zwiebeln.',
          icon: 'restaurant',
          accentColor: '#b83e3e',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-005.jpeg',
          priceLabel: '11,50 EUR'
        },
        {
          id: 'reis-gemuese',
          name: 'Reis mit Gemüse',
          description: 'Reis oder Bulgur mit Gemüse, Salat und verschiedenen hausgemachten Saucen.',
          icon: 'rice_bowl',
          accentColor: '#d69f5f',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-001.jpeg',
          priceLabel: '10,00 EUR'
        },
        {
          id: 'antipasti-teller',
          name: 'Antipasti Teller',
          description: 'Verschiedene Salate und Antipasti frisch aus der Feinkosttheke.',
          icon: 'restaurant_menu',
          accentColor: '#2f7d69',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
          priceLabel: 'Preis nach Gewicht'
        },
        {
          id: 'falafel-teller',
          name: 'Falafel Teller',
          description: 'Mit Falafel, Reis oder Bulgur, Salat und verschiedenen Saucen.',
          icon: 'restaurant_menu',
          accentColor: '#2f7d69',
          tags: ['vegetarisch'],
          imageUrl: 'assets/mediterrano-gallery/mediterrano-094.jpeg',
          priceLabel: '10,00 EUR'
        },
        {
          id: 'minibaguette-mediterran',
          name: 'Minibaguette Mediterran',
          description: 'Mit Aufstrich, Tomate, Feta und Avocado.',
          icon: 'lunch_dining',
          accentColor: '#b83e3e',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-004.jpeg',
          priceLabel: '8,50 EUR'
        },
        {
          id: 'antipasti-sandwich',
          name: 'Antipasti Sandwich',
          description: 'Mit Frischkäsecreme, Salat, Riesenbohnen, getrockneten Tomaten, Paprikatropfen und gegrillter Zucchini.',
          icon: 'lunch_dining',
          accentColor: '#b83e3e',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-003.jpeg',
          priceLabel: '8,90 EUR'
        },
        {
          id: 'toastteller',
          name: 'Toastteller',
          description: 'Mit Brot, Knoblauchwurst, Gouda, Tomaten, Gurken, Feta, Oliven und gefüllten Paprika.',
          icon: 'bakery_dining',
          accentColor: '#d69f5f',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-008.jpeg',
          priceLabel: '10,50 EUR'
        },
        {
          id: 'toastteller-vegetarisch',
          name: 'Toastteller Vegetarisch',
          description: 'Mit Gouda, Tomaten, Gurken, Feta, Oliven und gefüllten Paprika.',
          icon: 'bakery_dining',
          accentColor: '#d69f5f',
          tags: ['vegetarisch'],
          imageUrl: 'assets/mediterrano-gallery/mediterrano-088.jpeg',
          priceLabel: '10,50 EUR'
        },
        {
          id: 'toast',
          name: 'Toast',
          description: 'Brot mit Knoblauchwurst, Gouda und Tomatenmark.',
          icon: 'bakery_dining',
          accentColor: '#d69f5f',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-088.jpeg',
          priceLabel: '6,50 EUR'
        },
        {
          id: 'toast-vegetarisch',
          name: 'Toast Vegetarisch',
          description: 'Brot mit Gouda, Tomatenmark, getrockneten Tomaten oder gegrillten Champignons.',
          icon: 'bakery_dining',
          accentColor: '#2f7d69',
          tags: ['vegetarisch'],
          imageUrl: 'assets/mediterrano-gallery/mediterrano-004.jpeg',
          priceLabel: '6,50 EUR'
        },
        {
          id: 'linsensuppe',
          name: 'Linsensuppe',
          description: 'Hausgemachte Linsensuppe mit Brot.',
          icon: 'soup_kitchen',
          accentColor: '#b83e3e',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-001.jpeg',
          priceLabel: '5,90 EUR'
        },
        {
          id: 'gemuesesuppe',
          name: 'Gemüsesuppe',
          description: 'Hausgemachte Gemüsesuppe mit Brot.',
          icon: 'soup_kitchen',
          accentColor: '#2f7d69',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-001.jpeg',
          priceLabel: '5,90 EUR'
        },
        {
          id: 'manti',
          name: 'Manti',
          description: 'Maultaschen nach türkischer Art, auf Wunsch mit Beilagensalat.',
          icon: 'dinner_dining',
          accentColor: '#b83e3e',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-006.jpeg',
          priceLabel: '6,90 EUR'
        }
      ]
    },
    {
      id: 'fruehstueck',
      title: 'Mediterrano Frühstücksmenü',
      description: 'Frühstücken wie im Urlaub, aber mitten in Emmendingen.',
      icon: 'brunch_dining',
      items: [
        {
          id: 'klassisch-mediterran',
          name: 'Klassisch Mediterran',
          description: 'Mit Fladenbrot und Simit, Olivenauswahl, hausgemachten Brotaufstrichen und kleiner Käseauswahl.',
          icon: 'brunch_dining',
          accentColor: '#d69f5f',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
          priceLabel: '12,90 EUR'
        },
        {
          id: 'tuerkisches-genussfruehstueck',
          name: 'Türkisches Genussfrühstück',
          description: 'Mit Börek, Menemen, Schafskäse, Gurken, Tomaten sowie Çay oder Mokka.',
          icon: 'brunch_dining',
          accentColor: '#2f7d69',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-091.jpeg',
          priceLabel: '13,90 EUR'
        },
        {
          id: 'leicht-vital',
          name: 'Leicht & Vital',
          description: 'Mit Joghurt, Honig, Walnüssen, Haferflocken, frischem Obstteller, Ei und Tages-Saft.',
          icon: 'eco',
          accentColor: '#2f7d69',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-007.jpeg',
          priceLabel: '12,90 EUR'
        },
        {
          id: 'simit-toast-spezial',
          name: 'Simit-Toast Spezial',
          description: 'Mit Spiegelei, Tomaten, Gurken, Antipasti und auf Wunsch Sucuk sowie Ayran, Çay oder Tages-Saft.',
          icon: 'bakery_dining',
          accentColor: '#d69f5f',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-088.jpeg',
          priceLabel: '11,90 EUR'
        },
        {
          id: 'serpme-kahvalti',
          name: 'Spezial Serpme Kahvalti',
          description: 'Pro Person mit Simit, Fladenbrot, Käsevielfalt, Oliven, Aufstrichen, Marmelade, Honig, Börek und Ei-Variation.',
          icon: 'event',
          accentColor: '#b83e3e',
          tags: ['Samstags mit Reservierung'],
          imageUrl: 'assets/mediterrano-gallery/mediterrano-031.jpeg',
          priceLabel: '19,90 EUR'
        },
        {
          id: 'boerek',
          name: 'Börek & Börekstange',
          description: 'Mit Käse, Spinat, Kartoffel oder Hackfleisch als herzhafte Frühstücksbeilage.',
          icon: 'bakery_dining',
          accentColor: '#d69f5f',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-088.jpeg',
          priceLabel: 'ab 2,60 EUR'
        },
        {
          id: 'suesser-abschluss',
          name: 'Süßer Abschluss',
          description: 'Baklava, Kadaif und kleine süße Spezialitäten aus der Theke.',
          icon: 'bakery_dining',
          accentColor: '#b83e3e',
          imageUrl: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
          priceLabel: 'täglich frisch'
        }
      ]
    }
  ]);

  getCategories() {
    return this.categoriesSignal.asReadonly();
  }
}
