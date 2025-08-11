import { Injectable, signal } from '@angular/core';
import { MenuCategory } from '../models/menu';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly categoriesSignal = signal<MenuCategory[]>([
    {
      id: 'feinkost',
      title: 'Feinkost',
      description: 'Ausgewählte Delikatessen aus der Region und dem Mittelmeerraum.',
      icon: 'restaurant',
      items: [
        { id: 'oliven', name: 'Eingelegte Oliven', description: 'Verschiedene Sorten, sorgfältig eingelegt.', icon: 'spa', accentColor: '#2f7d69', priceLabel: '3,90€ / 100g', tags: ['vegan'] },
        { id: 'kaese', name: 'Käse', description: 'Auswahl exzellenter Käsesorten.', icon: 'local_pizza', accentColor: '#d69f5f', priceLabel: '2,90€ / 100g' },
        { id: 'aufstriche', name: 'Selbstgemachte frische Aufstriche', description: 'Ideal als Brotaufstrich oder Dip.', icon: 'restaurant', accentColor: '#b83e3e', priceLabel: '3,50€', tags: ['hausgemacht', 'vegetarisch'] }
      ]
    },
    {
      id: 'snacks',
      title: 'Snacks & Leckereien',
      description: 'Herzhafte und süße Kleinigkeiten für zwischendurch.',
      icon: 'lunch_dining',
      items: [
        { id: 'tagessuppe', name: 'Tagessuppe', description: 'Täglich frisch.', icon: 'soup_kitchen', accentColor: '#b83e3e', priceLabel: '4,90€' },
        { id: 'obstbecher', name: 'Obstbecher', description: 'Obstsalat, Ananas, Mango, Müsli, Granatapfelkerne.', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '3,50€', tags: ['frisch'] },
        { id: 'kuenefe', name: 'Künefe', icon: 'bakery_dining', accentColor: '#d69f5f', priceLabel: '6,50€' },
        { id: 'rote-linsenbaellchen', name: 'Rote Linsenbällchen', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '4,50€', tags: ['vegan'] },
        { id: 'kichererbsen-salat', name: 'Kichererbsensalat', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,50€', tags: ['vegan'] },
        { id: 'bagel', name: 'Bagel-Sandwich', icon: 'lunch_dining', accentColor: '#b83e3e', priceLabel: '5,90€' },
        { id: 'nudelsalat', name: 'Nudelsalat', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '4,90€', tags: ['vegetarisch'] },
        { id: 'reis-gemuese', name: 'Reis mit Gemüse', icon: 'rice_bowl', accentColor: '#2f7d69', priceLabel: '5,90€', tags: ['vegan'] },
        { id: 'tabbouleh', name: 'Tabbouleh mit Tomatensoße', icon: 'set_meal', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'antipasti-sandwich', name: 'Antipasti Sandwich', icon: 'lunch_dining', accentColor: '#b83e3e', priceLabel: '5,90€' },
        { id: 'antipasti-teller', name: 'Antipasti Teller', icon: 'restaurant_menu', accentColor: '#d69f5f', priceLabel: '8,90€' },
        { id: 'hummus', name: 'Hummus', icon: 'icecream', accentColor: '#2f7d69', priceLabel: '4,50€', tags: ['vegan'] },
        { id: 'baba-ghanoush', name: 'Baba Ghanoush', icon: 'spa', accentColor: '#2f7d69', priceLabel: '4,90€', tags: ['vegan'] },
        { id: 'tsatsiki', name: 'Tsatsiki', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '3,90€' },
        { id: 'weinblaetter', name: 'Gefüllte Weinblätter', icon: 'local_florist', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'mini-mozzarella', name: 'Mini-Mozzarella Salat', icon: 'local_pizza', accentColor: '#d69f5f', priceLabel: '5,90€' },
        { id: 'gigantbohnen', name: 'Gigantbohnen', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '5,50€' }
      ]
    },
    {
      id: 'salate',
      title: 'Salate',
      description: 'Frisch und knackig, mit vielfältigen Dressings.',
      icon: 'local_florist',
      items: [
        { id: 'verschiedene-salate', name: 'Verschiedene Salatsorten', description: 'Individuell kombinierbar.', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'mini-mozzarella-salat', name: 'Mini-Mozzarella-Salat', description: 'Mit Cherrytomaten, Rucola und Balsamico.', icon: 'local_pizza', accentColor: '#d69f5f', priceLabel: '6,50€' },
        { id: 'kichererbsensalat', name: 'Kichererbsensalat', icon: 'spa', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'tabbouleh-tomatensosse', name: 'Tabbouleh mit Tomatensoße', icon: 'set_meal', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'nudelsalat2', name: 'Nudelsalat', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'gruene-linsen', name: 'Grüne Linsensalat', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,90€' },
        { id: 'bulgur', name: 'Bulgursalat', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'kartoffel', name: 'Kartoffelsalat', icon: 'kebab_dining', accentColor: '#d69f5f', priceLabel: '4,90€' },
        { id: 'gurken', name: 'Gurkensalat', icon: 'spa', accentColor: '#2f7d69', priceLabel: '4,50€' },
        { id: 'kidneybohnen', name: 'Kidneybohnen Salat', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'tomaten', name: 'Tomatensalat', icon: 'spa', accentColor: '#b83e3e', priceLabel: '4,90€' },
        { id: 'karotten', name: 'Karottensalat', icon: 'spa', accentColor: '#d69f5f', priceLabel: '4,90€' },
        { id: 'paprika', name: 'Paprikasalat', icon: 'local_florist', accentColor: '#b83e3e', priceLabel: '4,90€' },
        { id: 'brokkoli', name: 'Brokkoli Salat', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,50€' },
        { id: 'hirtensalat', name: 'Hirtensalat', icon: 'lunch_dining', accentColor: '#d69f5f', priceLabel: '6,50€' }
      ]
    },
    {
      id: 'frische-speisen',
      title: 'Frische Speisen',
      icon: 'ramen_dining',
      items: [
        { id: 'suppe', name: 'Suppe', description: 'Täglich frisch zubereitet.', icon: 'soup_kitchen', accentColor: '#b83e3e', priceLabel: '4,90€' },
        { id: 'mittagstisch', name: 'Mittagstisch', description: 'Wechselndes Menü zur Mittagszeit.', icon: 'lunch_dining', accentColor: '#d69f5f', priceLabel: '8,90€' },
        { id: 'antipasti', name: 'Antipasti Teller', icon: 'restaurant_menu', accentColor: '#2f7d69', priceLabel: '8,90€' },
        { id: 'boerek', name: 'Börek', icon: 'bakery_dining', accentColor: '#d69f5f', priceLabel: '3,50€' },
        { id: 'sigara-boerek', name: 'Sigara Börek', icon: 'kebab_dining', accentColor: '#d69f5f', priceLabel: '3,90€' },
        { id: 'panini', name: 'Panini', icon: 'lunch_dining', accentColor: '#b83e3e', priceLabel: '5,90€' },
        { id: 'manti', name: 'Manti (türkische Maultaschen)', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '7,90€' }
      ]
    },
    {
      id: 'saft',
      title: 'Frisch gepresster Saft',
      description: 'Erfrischende Säfte, reich an Vitaminen.',
      icon: 'local_drink',
      items: [
        { id: 'safte', name: 'Orange, Apfel, Karotte, Granatapfel u.v.m.', icon: 'local_drink', accentColor: '#b83e3e', priceLabel: '3,50€' }
      ]
    },
    {
      id: 'getraenke',
      title: 'Getränke',
      icon: 'local_cafe',
      items: [
        { id: 'tuerkischer-kaffee', name: 'Türkischer Kaffee', icon: 'local_cafe', accentColor: '#6b4f3a', priceLabel: '2,50€' },
        { id: 'tuerkischer-tee', name: 'Türkischer Tee', icon: 'emoji_food_beverage', accentColor: '#b83e3e', priceLabel: '1,50€' },
        { id: 'marokkanischer-tee', name: 'Marokkanischer Tee (Minze Tee)', icon: 'emoji_food_beverage', accentColor: '#2f7d69', priceLabel: '1,90€' }
      ]
    },
    {
      id: 'oel-fruechte',
      title: 'Öl und Früchte',
      items: [
        { id: 'olivenoel', name: 'Qualitäts-Olivenöl', icon: 'opacity', accentColor: '#2f7d69', priceLabel: '6,90€' },
        { id: 'getrocknete-fruechte', name: 'Getrocknete Früchte', icon: 'restaurant', accentColor: '#d69f5f', priceLabel: '3,90€' }
      ]
    },
    {
      id: 'obst',
      title: 'Täglich Frisches Obst',
      description: 'Saisonale Obst- und Fruchtsorten wie Spargel, Erdbeeren, Orangen, Wassermelone und Trauben.',
      items: [
        { id: 'erdbeeren', name: 'Erdbeeren', icon: 'restaurant', accentColor: '#b83e3e', priceLabel: '2,90€' },
        { id: 'orangen', name: 'Orangen', icon: 'restaurant', accentColor: '#d69f5f', priceLabel: '2,50€' },
        { id: 'wassermelone', name: 'Wassermelone', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '3,90€' },
        { id: 'trauben', name: 'Trauben', icon: 'restaurant', accentColor: '#6b4f3a', priceLabel: '2,90€' }
      ]
    },
    {
      id: 'regional',
      title: 'Regionale Produkte',
      items: [
        { id: 'mehl-adlermuehle', name: 'Mehl von Adlermühle', icon: 'bakery_dining', accentColor: '#d69f5f', priceLabel: '2,90€' },
        { id: 'nudeln-breisach', name: 'Handgemachte Nudeln aus Breisach', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '3,90€' },
        { id: 'saft-jung', name: 'Saft von Firma Jung', icon: 'local_drink', accentColor: '#b83e3e', priceLabel: '1,90€' },
        { id: 'eier-forchheim', name: 'Freilaufende Eier aus Forchheim', icon: 'egg', accentColor: '#d69f5f', priceLabel: '2,90€' }
      ]
    },
    {
      id: 'pakete',
      title: 'Pakete & Angebote',
      description: 'Perfekt zum Mitnehmen oder als Geschenk.',
      items: [
        { id: 'fruehstuecks-paket', name: 'Frühstücks-Paket', description: 'Simit/Börek, Aufstriche, Oliven & Käse', icon: 'brunch_dining', accentColor: '#d69f5f', priceLabel: '12,90€' },
        { id: 'mezze-paket', name: 'Mezze-Paket', description: 'Hummus, Baba Ghanoush, Tsatsiki & Antipasti', icon: 'restaurant_menu', accentColor: '#2f7d69', priceLabel: '14,90€' },
        { id: 'catering', name: 'Catering Anfrage', description: 'Individuelle Angebote für Events', icon: 'event', accentColor: '#2f7d69', priceLabel: 'auf Anfrage', tags: ['auf Anfrage'] }
      ]
    }
  ]);

  getCategories() {
    return this.categoriesSignal.asReadonly();
  }
} 