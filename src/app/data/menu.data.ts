export interface MenuEntry {
  name: string;
  description: string;
  price?: string;
  image?: string;
}
export interface MenuSection {
  id: string;
  title: string;
  description: string;
  items: MenuEntry[];
}
// Transcribed from supplied brochure, 2026-11-11. Cropped prices omitted.
// Börek suffixes distinguish the pictured shapes.
export const MENU: MenuSection[] = [
  {
    id: 'fruehstueck',
    title: 'Frühstück',
    description:
      'Zeit für einen guten Morgen. Mit Simit, herzhaften Kleinigkeiten und Çay.',
    items: [
      {
        name: 'Leicht & Vital',
        description:
          'Joghurt mit Honig und Haferflocken, frischer Obstteller, Ei nach Wahl (Spiegelei) und frisch gepresster Saft.',
        price: '14,90 €',
      },
      {
        name: 'Simit-Toast Spezial',
        description:
          'Simit mit Knoblauchwurst und Gouda, Tomaten, Gurken und Antipasti. Dazu ein Ei nach Wahl, frisch gepresster Tagessaft (0,3 l) und Çay.',
        price: '13,90 €',
      },
      {
        name: 'Türkisches Genussfrühstück',
        description:
          'Börek, Menemen mit Tomaten und Paprika, Schafskäse, Gurken und Tomaten. Dazu türkischer Mokka oder Çay.',
        price: '15,90 €',
      },
      {
        name: 'Klassisch Mediterran',
        description:
          'Simit und frisches Fladenbrot, Käseauswahl, Oliven, Tomaten, Gurken, Paprika, hausgemachte Aufstriche, Marmelade, Honig mit Kaymak, Börek, Ei nach Wahl und Çay.',
        price: '14,90 €',
      },
      {
        name: 'Spezial Serpme Frühstück',
        description:
          'Brot, Käse, Oliven, hausgemachte Aufstriche und Börek sowie Menemen oder Ei mit Sucuk. Inklusive unbegrenzt Çay.',
        price: '19,90 € / Person',
      },
      {
        name: 'Frühstücks-Extras',
        description:
          'Sucuk +2,00 € · Simit +2,00 € · Börek +3,50 € · Käse +3,50 €',
      },
    ],
  },
  {
    id: 'hauptgerichte',
    title: 'Bowls & Hauptgerichte',
    description: 'Für die Mittagspause oder einen entspannten Teller bei uns.',
    items: [
      {
        name: 'Bowl vegetarisch',
        image: 'assets/mediterrano-gallery/mediterrano-010.jpeg',
        description:
          'Reis oder Bulgur mit Salat, Kichererbsen, Tomaten, Gurken, Mais, Oliven, Fetakäse, roten Zwiebeln und Sauce.',
        price: '12,90 €',
      },
      {
        name: 'Bowl mit Hähnchen',
        image: 'assets/mediterrano-gallery/mediterrano-005.jpeg',
        description:
          'Hähnchenbrustfilet auf Reis oder Bulgur mit Salat, Kichererbsen, Tomaten, Gurken, Mais, roten Zwiebeln und hausgemachter Sauce.',
        price: '13,50 €',
      },
      {
        name: 'Antipasti-Bowl',
        description:
          'Reis oder Bulgur mit gegrillter Zucchini, Aubergine, Champignons, Kirschtomaten, Paprikatropfen, roten Zwiebeln, getrockneten Tomaten, Oliven und Fetakäse.',
        price: '15,00 €',
      },
      {
        name: 'Falafelteller',
        description: 'Reis oder Bulgur, Falafel, Salat und Saucen.',
        price: '12,50 €',
      },
      {
        name: 'Reis oder Bulgur mit Gemüse',
        image: 'assets/mediterrano-gallery/mediterrano-001.jpeg',
        description: 'Mit mediterranem Gemüse, frischem Salat und Sauce.',
        price: '12,50 €',
      },
      {
        name: 'Manti (Maultaschen)',
        description:
          'Traditionelle türkische Teigtaschen mit Hackfleischfüllung. Auf Wunsch mit Beilagensalat (+3,50 €).',
        price: '10,00 €',
      },
      {
        name: 'Antipastiteller',
        image: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
        description: 'Verschiedene mediterrane Spezialitäten.',
        price: 'Preis nach Gewicht',
      },
      {
        name: 'Country Potatoes',
        description: 'Knusprige Kartoffelspalten mit feiner Kräuterwürzung.',
        price: '5,50 €',
      },
    ],
  },
  {
    id: 'sandwiches',
    title: 'Snacks & Sandwiches',
    description: 'Knuspriges Brot, würzige Füllungen und frische Begleiter.',
    items: [
      {
        name: 'Mediterranes Minibaguette',
        image: 'assets/mediterrano-gallery/mediterrano-004.jpeg',
        description: 'Hausgemachter Aufstrich, Tomaten, Feta und Avocado.',
        price: '10,50 €',
      },
      {
        name: 'Antipasti-Sandwich',
        image: 'assets/mediterrano-gallery/mediterrano-003.jpeg',
        description:
          'Hausgemachter Aufstrich, Salat, Riesenbohnen, getrocknete Tomaten, gegrillte Zucchini und Paprikatropfen.',
        price: '9,50 €',
      },
      {
        name: 'Falafel-Sandwich',
        description:
          'Mischsalat, Tomaten, Gurken, rote Zwiebeln, Falafel und Sauce.',
        price: '9,50 €',
      },
      {
        name: 'Baguette mit Hähnchen',
        description:
          'Hähnchenbrustfilet, Mischsalat, Tomaten, Gurken, Mais und Sauce.',
        price: '12,50 €',
      },
      {
        name: 'Toastteller',
        image: 'assets/mediterrano-gallery/mediterrano-008.jpeg',
        description:
          'Tomatenmark, Knoblauchwurst, Gouda, Tomaten, Gurken, Fetakäse, Oliven, Paprikatropfen sowie Kirschpaprika und Peperoni mit Frischkäse.',
        price: '12,50 €',
      },
      {
        name: 'Toastteller vegetarisch',
        image: 'assets/mediterrano-gallery/mediterrano-009.jpeg',
        description:
          'Tomatenmark, Gouda, Tomaten, Gurken, Fetakäse, Oliven, Paprikatropfen sowie Kirschpaprika und Peperoni mit Frischkäse.',
        price: '12,50 €',
      },
      {
        name: 'Toast',
        description: 'Knoblauchwurst, Gouda und Tomatenmark.',
        price: '8,50 €',
      },
      {
        name: 'Toast vegetarisch',
        description:
          'Gouda, Tomatenmark und getrocknete Tomaten oder gegrillte Champignons.',
        price: '8,50 €',
      },
    ],
  },
  {
    id: 'boerek',
    title: 'Börek-Spezialitäten',
    description: 'Goldbrauner Teig und herzhafte Füllungen.',
    items: [
      {
        name: 'Börekstange',
        description: 'Wahlweise mit Käse-Spinat- oder Käsefüllung.',
        price: '2,60 €',
      },
      {
        name: 'Börek · Schnecke',
        description:
          'Wahlweise mit Käse-Spinat-, Hackfleisch-, Kartoffel- oder Käsefüllung.',
        price: '3,50 €',
      },
      {
        name: 'Börek · Stück',
        description:
          'Wahlweise mit Käse-Spinat-, Hackfleisch- oder Käsefüllung.',
        price: '4,00 €',
      },
    ],
  },
  {
    id: 'suppen',
    title: 'Suppen',
    description: 'Ein warmer Teller, dazu Brot.',
    items: [
      {
        name: 'Linsensuppe mit Brot',
        description: '',
        price: '5,90 €',
      },
      {
        name: 'Gemüsesuppe mit Brot',
        description: '',
        price: '5,90 €',
      },
    ],
  },
  {
    id: 'theke',
    title: 'Salate & Feinkost',
    description:
      'Aus unserer Theke. Die Preise dieser Auswahl erfahren Sie vor Ort.',
    items: [
      {
        name: 'Kichererbsensalat',
        description: '',
      },
      {
        name: 'Bulgursalat',
        image: 'assets/mediterrano-gallery/mediterrano-094.jpeg',
        description: '',
      },
      {
        name: 'Rote Bete Salat',
        description: '',
      },
      {
        name: 'Grüne Linsen Salat',
        description: '',
      },
      {
        name: 'Hirtensalat',
        description: '',
      },
      {
        name: 'Rote Linsenbällchen',
        description: '',
      },
      {
        name: 'Ofengemüse',
        description: '',
      },
      {
        name: 'Hausgemachte Aufstriche',
        image: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
        description: 'Cremige Dips, Hummus und Baba Ghanoush.',
      },
      {
        name: 'Olivenvielfalt',
        image: 'assets/mediterrano-gallery/mediterrano-040.jpeg',
        description: 'Grüne, schwarze, gefüllte und marinierte Oliven.',
      },
      {
        name: 'Frischkäserollen',
        image: 'assets/mediterrano-gallery/mediterrano-052.jpeg',
        description: 'Mit Pistazie, Paprika und weiteren Füllungen.',
      },
      {
        name: 'Gefüllte Spezialitäten',
        image: 'assets/mediterrano-gallery/mediterrano-043.jpeg',
        description: 'Kirschpaprika und Peperoni mit Frischkäse.',
      },
      {
        name: 'Frischer Obstbecher',
        image: 'assets/mediterrano-gallery/mediterrano-007.jpeg',
        description: 'Saisonale Fruchtauswahl.',
      },
    ],
  },
  {
    id: 'suesses',
    title: 'Süßes',
    description: 'Für die Kaffeepause und zum Mitnehmen. Preise vor Ort.',
    items: [
      {
        name: 'Baklava',
        image: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
        description: 'Blättriges Gebäck mit Nüssen.',
      },
      {
        name: 'Lokumselektion',
        image: 'assets/mediterrano-gallery/mediterrano-054.jpeg',
        description: 'Eine Auswahl türkischer Süßigkeiten.',
      },
      {
        name: 'Kadaif',
        description: 'Süße Spezialität aus feinen Teigfäden.',
      },
    ],
  },
  {
    id: 'getraenke',
    title: 'Tee & Kaffee',
    description:
      'Ein Glas Çay, ein türkischer Kaffee, ein Moment für sich. Preise vor Ort.',
    items: [
      {
        name: 'Pfefferminztee',
        description: '',
      },
      {
        name: 'Türkischer Apfeltee',
        description: '',
      },
      {
        name: 'Frühstückstee (Kräutertee)',
        description: '',
      },
      {
        name: 'Brotzeit (Kräutertee)',
        description: '',
      },
      {
        name: 'Vanille (Rooibos)',
        description: '',
      },
      {
        name: 'Earl Grey',
        description: '',
      },
      {
        name: 'Beerenkorb',
        description: '',
      },
      {
        name: 'Sanddorn Holunder',
        description: '',
      },
      {
        name: 'Darjeeling Blend',
        description: '',
      },
      {
        name: 'Grüner Tee',
        description: '',
      },
      {
        name: 'Türkischer Schwarztee',
        description: '',
      },
      {
        name: 'Türkischer Kaffee',
        description: '',
      },
      {
        name: 'Kaffee',
        description: '',
      },
      {
        name: 'Cappuccino',
        description: '',
      },
      {
        name: 'Espresso',
        description: '',
      },
    ],
  },
];
