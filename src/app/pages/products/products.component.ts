import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

type ProductItem = {
  name: string;
  description: string;
  image: string;
  note?: string;
  price?: string;
};

type ProductCategory = {
  title: string;
  description: string;
  items: ProductItem[];
};

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  readonly categories: ProductCategory[] = [
    {
      title: 'Frühstück & Leichte Begleiter',
      description: 'Leichte Frühstücksideen, hausgemachte Aufstriche und süße Begleiter für den Start in den Tag.',
      items: [
        {
          name: 'Hausgemachte Aufstriche',
          description: 'Verschiedene cremige Dips und Brotaufstriche, ideal zu Simit, Fladenbrot und kleinen Frühstücksplatten.',
          image: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
          note: 'hausgemacht'
        },
        {
          name: 'Aufstrichauswahl',
          description: 'Mehrere mediterrane Cremes und Dips in kleiner Auswahl für die Theke oder den Frühstückstisch.',
          image: 'assets/mediterrano-gallery/mediterrano-031.jpeg',
          note: 'frisch aus der Theke'
        },
        {
          name: 'Frischer Obstbecher',
          description: 'Leichte Fruchtauswahl mit saisonalen Stücken für einen frischen, unkomplizierten Genussmoment.',
          image: 'assets/mediterrano-gallery/mediterrano-007.jpeg',
          note: 'leicht & frisch'
        },
        {
          name: 'Simit mit Ei',
          description: 'Sesamring mit Ei und knackigen Beilagen als herzhafte Frühstücksoption.',
          image: 'assets/mediterrano-gallery/mediterrano-088.jpeg',
          price: 'je nach Auswahl'
        },
        {
          name: 'Mediterrane Dips & Cremes',
          description: 'Feine Dips, Olivencremes und würzige Aufstriche für Brot, Platten und kleine Pausen.',
          image: 'assets/mediterrano-gallery/mediterrano-091.jpeg',
          note: 'zum Mitnehmen'
        },
        {
          name: 'Baklava & Kadaif',
          description: 'Klassische süße Spezialitäten für die Kaffeepause oder als süßer Abschluss.',
          image: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
          note: 'täglich frisch'
        }
      ]
    },
    {
      title: 'Warme Gerichte & Snacks',
      description: 'Bowls, Toasts, Sandwiches und sättigende Teller für den Genuss vor Ort oder zum Mitnehmen.',
      items: [
        {
          name: 'Bowl Vegetarisch',
          description: 'Mit Reis oder Bulgur, Salat, Kichererbsen, Tomaten, Gurken, Mais, Oliven, Feta und roten Zwiebeln.',
          image: 'assets/mediterrano-gallery/mediterrano-010.jpeg',
          price: '10,50 EUR'
        },
        {
          name: 'Bowl mit Hähnchen',
          description: 'Mit Hähnchenbrustfilet, Reis oder Bulgur, Salat, Kichererbsen, Tomaten, Gurken, Mais und roten Zwiebeln.',
          image: 'assets/mediterrano-gallery/mediterrano-005.jpeg',
          price: '11,50 EUR'
        },
        {
          name: 'Reis mit Gemüse',
          description: 'Reis oder Bulgur mit Gemüse, Salat und verschiedenen hausgemachten Saucen.',
          image: 'assets/mediterrano-gallery/mediterrano-001.jpeg',
          price: '10,00 EUR'
        },
        {
          name: 'Gemüse-Reis-Bowl',
          description: 'Warme Reisbowl mit Gemüse und frischen Beilagen für eine leichte, sättigende Mahlzeit.',
          image: 'assets/mediterrano-gallery/mediterrano-006.jpeg',
          price: 'nach Tagesauswahl'
        },
        {
          name: 'Antipasti Teller',
          description: 'Verschiedene Salate, Antipasti und mediterrane Feinkost frisch aus der Theke.',
          image: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
          price: 'Preis nach Gewicht'
        },
        {
          name: 'Kisir / Bulgursalat',
          description: 'Würziger Bulgursalat mit frischen Beilagen als leichter Teller für zwischendurch.',
          image: 'assets/mediterrano-gallery/mediterrano-094.jpeg',
          price: 'nach Tagesauswahl'
        },
        {
          name: 'Mediterranes Sandwich',
          description: 'Mit Frischkäsecreme, Salat, gegrilltem Gemüse und würzigen Zutaten im knusprigen Brot.',
          image: 'assets/mediterrano-gallery/mediterrano-003.jpeg',
          price: '8,90 EUR'
        },
        {
          name: 'Minibaguette Mediterran',
          description: 'Mit Aufstrich, Tomate, Käse und knackigen frischen Komponenten.',
          image: 'assets/mediterrano-gallery/mediterrano-004.jpeg',
          price: '8,50 EUR'
        },
        {
          name: 'Toastteller',
          description: 'Geröstetes Brot mit geschmolzenem Käse und mediterranen Beilagen.',
          image: 'assets/mediterrano-gallery/mediterrano-008.jpeg',
          price: '10,50 EUR'
        }
      ]
    },
    {
      title: 'Feinkost & Antipasti',
      description: 'Mediterrane Spezialitäten aus der Theke für Zuhause, Gäste und den täglichen Genuss.',
      items: [
        {
          name: 'Antipasti Teller',
          description: 'Eine abwechslungsreiche Auswahl aus der Feinkosttheke mit mediterranen Klassikern.',
          image: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
          note: 'aus der Theke'
        },
        {
          name: 'Gefüllte Frischkäserollen',
          description: 'Feine Käserollen mit verschiedenen Füllungen, Kräutern und dekorativen Ummantelungen.',
          image: 'assets/mediterrano-gallery/mediterrano-052.jpeg',
          note: 'zum Mitnehmen'
        },
        {
          name: 'Börek',
          description: 'Herzhafte Teigspezialitäten mit unterschiedlichen Füllungen für Theke und Genussplatte.',
          image: 'assets/mediterrano-gallery/mediterrano-088.jpeg',
          note: 'je nach Tagesauswahl'
        },
        {
          name: 'Hummus',
          description: 'Cremiger Kichererbsenaufstrich als Klassiker der mediterranen Theke.',
          image: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
          note: 'hausgemacht'
        },
        {
          name: 'Baba Ghanoush',
          description: 'Aromatischer Auberginenaufstrich mit mediterraner Würze und feiner Rauchnote.',
          image: 'assets/mediterrano-gallery/mediterrano-091.jpeg',
          note: 'hausgemacht'
        },
        {
          name: 'Olivenvielfalt',
          description: 'Grüne, schwarze, gefüllte und marinierte Oliven für jede Geschmacksrichtung.',
          image: 'assets/mediterrano-gallery/mediterrano-040.jpeg',
          note: 'nach Auswahl'
        }
      ]
    },
    {
      title: 'Süßes & Mitnahme',
      description: 'Süße Spezialitäten, kleine Geschenke und Produkte zum Mitnehmen oder Teilen.',
      items: [
        {
          name: 'Baklava',
          description: 'Blättrige Süßspeise mit Nüssen als beliebter Klassiker für die Kaffeepause.',
          image: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
          note: 'frisch aus der Theke'
        },
        {
          name: 'Kadaif',
          description: 'Feine orientalische Süßigkeit mit knuspriger Struktur und süßem Aroma.',
          image: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
          note: 'frisch aus der Theke'
        },
        {
          name: 'Süße Röllchen & Gebäck',
          description: 'Bunte süße Rollen und kleines Gebäck für gemischte Platten, Mitbringsel oder den Nachmittagskaffee.',
          image: 'assets/mediterrano-gallery/mediterrano-054.jpeg',
          note: 'gemischte Auswahl'
        },
        {
          name: 'Geschenk & Mitnahme',
          description: 'Produkte und Kombinationen, die sich auch wunderbar als Mitbringsel oder kleines Geschenk eignen.',
          image: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
          note: 'individuell kombinierbar'
        }
      ]
    }
  ];
}
