import { Component, computed, inject } from '@angular/core';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, SlicePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly menuService = inject(MenuService);
  categories = this.menuService.getCategories();
  readonly breakfastCategoryId = 'fruehstueck';
  readonly lunchCategoryId = 'mittags-menue';
  mapEnabled = false;

  readonly signatureProducts = [
    {
      title: 'Antipasti & Feinkostteller',
      text: 'Gefüllte Spezialitäten, Oliven, gegrilltes Gemüse und hausgemachte Beilagen direkt aus der Theke.',
      image: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
      label: 'Hausgemacht'
    },
    {
      title: 'Bowls & warme Mittagsgerichte',
      text: 'Reis, Bulgur, Bowls und Tellergerichte für alle, die mittags frisch, ausgewogen und schnell genießen wollen.',
      image: 'assets/mediterrano-gallery/mediterrano-001.jpeg',
      label: 'Täglich frisch'
    },
    {
      title: 'Oliven, Aufstriche & süße Theke',
      text: 'Von hausgemachten Cremes bis zu Oliven, Baklava und kleinen Delikatessen für zuhause oder als Geschenk.',
      image: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
      label: 'Feinkost für zuhause'
    }
  ];

  readonly experienceMoments = [
    {
      overline: 'Früh',
      title: 'Frühstück mit Seele',
      text: 'Simit, Menemen, Käse, Oliven, hausgemachte Aufstriche und frische Begleiter für einen echten Genussstart.'
    },
    {
      overline: 'Mittags',
      title: 'Schnell, frisch, voller Geschmack',
      text: 'Bowls, Reisgerichte, Teller und Sandwiches sind ideal für Mittagspause, Laufkundschaft und ehrlichen Genuss.'
    },
    {
      overline: 'Den ganzen Tag',
      title: 'Feinkost aus der Theke',
      text: 'Oliven, Aufstriche, gefüllte Spezialitäten, süße Stücke und hausgemachte Klassiker für zuhause oder zum Mitnehmen.'
    }
  ];

  readonly deliHighlights = [
    {
      title: 'Hausgemachte Aufstriche',
      text: 'Cremige Dips und Brotaufstriche für Simit, Fladenbrot und Frühstücksplatten.',
      image: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
      note: 'frisch aus der Theke'
    },
    {
      title: 'Olivenvielfalt',
      text: 'Grüne, schwarze, gefüllte und marinierte Oliven für jeden Geschmack.',
      image: 'assets/mediterrano-gallery/mediterrano-040.jpeg',
      note: 'nach Auswahl'
    },
    {
      title: 'Gefüllte Spezialitäten',
      text: 'Kirschpaprika, Peperoni und weitere kleine Feinkostmomente für Teller und Theke.',
      image: 'assets/mediterrano-gallery/mediterrano-050.jpeg',
      note: 'perfekt zum Mitnehmen'
    },
    {
      title: 'Feinkostrollen',
      text: 'Besondere Thekenspezialitäten mit kräftigen Farben, feinen Füllungen und starker Präsenz.',
      image: 'assets/mediterrano-gallery/mediterrano-054.jpeg',
      note: 'besondere Auswahl'
    },
    {
      title: 'Baklava & süße Ecke',
      text: 'Baklava, Kadaif und kleine Desserts für den süßen Abschluss oder den Kaffeemoment.',
      image: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
      note: 'täglich frisch'
    },
    {
      title: 'Frische Obstbegleiter',
      text: 'Leichte, frische Komponenten, die besonders gut zu Frühstück und Vital-Angeboten passen.',
      image: 'assets/mediterrano-gallery/mediterrano-007.jpeg',
      note: 'leicht & saisonal'
    }
  ];

  readonly packageMenus = [
    {
      name: 'Frühstückstafel',
      price: 'ab 22,90 EUR pro Person',
      audience: 'Für Familie, Freunde und Wochenend-Reservierungen',
      items: ['Simit und Fladenbrot', 'Käse-, Oliven- und Dip-Auswahl', 'Eiergericht nach Wahl', 'Saft und Çay']
    },
    {
      name: 'Business Lunch Table',
      price: 'ab 15,90 EUR pro Person',
      audience: 'Für Teams, Besprechungen und Kanzleien',
      items: ['1 warmes Hauptgericht', '2 mediterrane Beilagen', 'Brot und hausgemachter Dip', 'Schneller Service']
    },
    {
      name: 'Feinkost Eventplatte',
      price: 'ab 39,00 EUR pro Platte',
      audience: 'Für Geburtstage, Büros und kleine Feiern',
      items: ['Antipasti-Komposition', 'Hausgemachte Aufstriche', 'Oliven und Fingerfood', 'Optional süßer Abschluss']
    }
  ];

  readonly promisePoints = [
    'Hausgemacht statt beliebig: viele Produkte entstehen frisch in eigener Vorbereitung.',
    'Breites Sortiment aus Frühstück, Mittag, Feinkost, Theke und Getränken.',
    'Mediterrane Handschrift mit regionalem Bezug und ehrlichen Zutaten.',
    'Ein Ort für schnellen Einkauf, Mittagspause und entspannten Genuss zugleich.'
  ];

  readonly galleryImages = [
    {
      src: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
      alt: 'Mediterrano Antipasti Teller mit Feinkost und mediterranen Spezialitäten',
      tall: true
    },
    {
      src: 'assets/mediterrano-gallery/mediterrano-028.jpeg',
      alt: 'Mediterrano hausgemachte Aufstriche'
    },
    {
      src: 'assets/mediterrano-gallery/mediterrano-040.jpeg',
      alt: 'Mediterrano Olivenauswahl'
    },
    {
      src: 'assets/mediterrano-gallery/mediterrano-054.jpeg',
      alt: 'Mediterrano Feinkostrollen und Spezialitäten'
    },
    {
      src: 'assets/mediterrano-gallery/mediterrano-066.jpeg',
      alt: 'Mediterrano Baklava und süße Spezialitäten'
    },
    {
      src: 'assets/mediterrano-gallery/mediterrano-091.jpeg',
      alt: 'Mediterrano Frühstücksgericht mit Simit und Ei'
    }
  ];

  breakfastPreview = computed(() =>
    this.categories().find((cat) => cat.id === this.breakfastCategoryId)
  );

  lunchPreview = computed(() =>
    this.categories().find((cat) => cat.id === this.lunchCategoryId)
  );

  enableMap(): void {
    this.mapEnabled = true;
  }
}

