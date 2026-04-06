import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  mapEnabled = false;

  readonly signatureProducts = [
    {
      title: 'Antipasti & Feinkostteller',
      text: 'Gefüllte Spezialitäten, Oliven, gegrilltes Gemüse und hausgemachte Beilagen direkt aus der Theke.',
      image: 'assets/mediterrano-gallery/mediterrano-002.jpeg',
      label: 'Hausgemacht'
    },
    {
      title: 'Tagesfrische Auswahl',
      text: 'Feinkost, Antipasti, Aufstriche und wechselnde Spezialitäten für alle, die Qualität und Geschmack mitnehmen möchten.',
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
      overline: 'Vormittags',
      title: 'Café mit Charakter',
      text: 'Ein Ort für guten Kaffee, kleine Pausen und mediterrane Genussmomente mitten in Emmendingen.'
    },
    {
      overline: 'Tagsüber',
      title: 'Feinkost zum Entdecken',
      text: 'Aufstriche, Antipasti, Oliven und Spezialitäten bringen Vielfalt in den Alltag und auf jede Tafel.'
    },
    {
      overline: 'Zum Mitnehmen',
      title: 'Frisch, ehrlich, besonders',
      text: 'Hausgemachte Produkte, wechselnde Auswahl und mediterrane Klassiker für zuhause oder als Mitbringsel.'
    }
  ];

  readonly deliHighlights = [
    {
      title: 'Hausgemachte Aufstriche',
      text: 'Cremige Dips und Brotaufstriche für Simit, Fladenbrot und kleine Genussplatten.',
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
      text: 'Leichte, frische Komponenten, die besonders gut zu Kaffee, Feinkost und saisonalen Produkten passen.',
      image: 'assets/mediterrano-gallery/mediterrano-007.jpeg',
      note: 'leicht & saisonal'
    }
  ];

  readonly packageMenus = [
    {
      name: 'Feinkostplatte',
      price: 'ab 39,00 EUR pro Platte',
      audience: 'Für Familien, Freunde und kleine Feiern',
      items: ['Antipasti-Komposition', 'Hausgemachte Aufstriche', 'Oliven und Fingerfood', 'Individuell anpassbar']
    },
    {
      name: 'Café & Genussrunde',
      price: 'auf Anfrage',
      audience: 'Für Gruppen, Besprechungen und Reservierungen',
      items: ['Kaffee und Heißgetränke', 'Süße Begleiter', 'Herzhafte Feinkostauswahl', 'Persönliche Abstimmung']
    },
    {
      name: 'Geschenk & Mitnahme',
      price: 'individuell',
      audience: 'Für Gastgeber, Events und besondere Anlässe',
      items: ['Feinkostprodukte nach Wahl', 'Süße Spezialitäten', 'Oliven und Aufstriche', 'Saisonal kombinierbar']
    }
  ];

  readonly promisePoints = [
    'Hausgemacht statt beliebig: viele Produkte entstehen frisch in eigener Vorbereitung.',
    'Breites Sortiment aus Feinkost, Theke, Café und mediterranen Spezialitäten.',
    'Mediterrane Handschrift mit regionalem Bezug und ehrlichen Zutaten.',
    'Ein Ort für schnellen Einkauf, kleine Pausen und entspannten Genuss zugleich.'
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
      alt: 'Mediterrano Spezialitäten aus der Theke'
    }
  ];

  enableMap(): void {
    this.mapEnabled = true;
  }
}
