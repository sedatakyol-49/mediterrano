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
        { id: 'oliven', name: 'Eingelegte Oliven', description: 'Verschiedene Sorten, sorgfältig eingelegt.', icon: 'spa', accentColor: '#2f7d69', priceLabel: '3,90€ / 100g', tags: ['vegan'], imageUrl: 'https://images.unsplash.com/photo-1611171711921-ad8129d85bdb?q=80&w=400&auto=format&fit=crop' },
        { id: 'kaese', name: 'Käse', description: 'Auswahl exzellenter Käsesorten.', icon: 'local_pizza', accentColor: '#d69f5f', priceLabel: '2,90€ / 100g', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=400&auto=format&fit=crop' },
        { id: 'aufstriche', name: 'Selbstgemachte frische Aufstriche', description: 'Ideal als Brotaufstrich oder Dip.', icon: 'restaurant', accentColor: '#b83e3e', priceLabel: '3,50€', tags: ['hausgemacht', 'vegetarisch'], imageUrl: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'snacks',
      title: 'Snacks & Leckereien',
      description: 'Herzhafte und süße Kleinigkeiten für zwischendurch.',
      icon: 'lunch_dining',
      items: [
        { id: 'tagessuppe', name: 'Tagessuppe', description: 'Täglich frisch.', icon: 'soup_kitchen', accentColor: '#b83e3e', priceLabel: '4,90€', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop' },
        { id: 'obstbecher', name: 'Obstbecher', description: 'Obstsalat, Ananas, Mango, Müsli, Granatapfelkerne.', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '3,50€', tags: ['frisch'], imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=400&auto=format&fit=crop' },
        { id: 'kuenefe', name: 'Künefe', icon: 'bakery_dining', accentColor: '#d69f5f', priceLabel: '6,50€', imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop' },
        { id: 'rote-linsenbaellchen', name: 'Rote Linsenbällchen', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '4,50€', tags: ['vegan'], imageUrl: 'https://images.unsplash.com/photo-1574653969557-2cca8fdeacfd?q=80&w=400&auto=format&fit=crop' },
        { id: 'kichererbsen-salat', name: 'Kichererbsensalat', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,50€', tags: ['vegan'], imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
        { id: 'bagel', name: 'Bagel-Sandwich', icon: 'lunch_dining', accentColor: '#b83e3e', priceLabel: '5,90€', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
        { id: 'nudelsalat', name: 'Nudelsalat', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '4,90€', tags: ['vegetarisch'], imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=400&auto=format&fit=crop' },
        { id: 'reis-gemuese', name: 'Reis mit Gemüse', icon: 'rice_bowl', accentColor: '#2f7d69', priceLabel: '5,90€', tags: ['vegan'], imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
        { id: 'tabbouleh', name: 'Tabbouleh mit Tomatensoße', icon: 'set_meal', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1529059997904-8c22265e25fd?q=80&w=400&auto=format&fit=crop' },
        { id: 'antipasti-sandwich', name: 'Antipasti Sandwich', icon: 'lunch_dining', accentColor: '#b83e3e', priceLabel: '5,90€', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?q=80&w=400&auto=format&fit=crop' },
        { id: 'antipasti-teller', name: 'Antipasti Teller', icon: 'restaurant_menu', accentColor: '#d69f5f', priceLabel: '8,90€', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
        { id: 'hummus', name: 'Hummus', icon: 'icecream', accentColor: '#2f7d69', priceLabel: '4,50€', tags: ['vegan'], imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop' },
        { id: 'baba-ghanoush', name: 'Baba Ghanoush', icon: 'spa', accentColor: '#2f7d69', priceLabel: '4,90€', tags: ['vegan'], imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=400&auto=format&fit=crop' },
        { id: 'tsatsiki', name: 'Tsatsiki', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '3,90€', imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=400&auto=format&fit=crop' },
        { id: 'weinblaetter', name: 'Gefüllte Weinblätter', icon: 'local_florist', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400&auto=format&fit=crop' },
        { id: 'mini-mozzarella', name: 'Mini-Mozzarella Salat', icon: 'local_pizza', accentColor: '#d69f5f', priceLabel: '5,90€', imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=400&auto=format&fit=crop' },
        { id: 'gigantbohnen', name: 'Gigantbohnen', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'salate',
      title: 'Salate',
      description: 'Frisch und knackig, mit vielfältigen Dressings.',
      icon: 'local_florist',
      items: [
        { id: 'verschiedene-salate', name: 'Verschiedene Salatsorten', description: 'Individuell kombinierbar.', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
        { id: 'mini-mozzarella-salat', name: 'Mini-Mozzarella-Salat', description: 'Mit Cherrytomaten, Rucola und Balsamico.', icon: 'local_pizza', accentColor: '#d69f5f', priceLabel: '6,50€', imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=400&auto=format&fit=crop' },
        { id: 'kichererbsensalat', name: 'Kichererbsensalat', icon: 'spa', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
        { id: 'tabbouleh-tomatensosse', name: 'Tabbouleh mit Tomatensoße', icon: 'set_meal', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1529059997904-8c22265e25fd?q=80&w=400&auto=format&fit=crop' },
        { id: 'nudelsalat2', name: 'Nudelsalat', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=400&auto=format&fit=crop' },
        { id: 'gruene-linsen', name: 'Grüne Linsensalat', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,90€', imageUrl: 'https://images.unsplash.com/photo-1574653969557-2cca8fdeacfd?q=80&w=400&auto=format&fit=crop' },
        { id: 'bulgur', name: 'Bulgursalat', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1529059997904-8c22265e25fd?q=80&w=400&auto=format&fit=crop' },
        { id: 'kartoffel', name: 'Kartoffelsalat', icon: 'kebab_dining', accentColor: '#d69f5f', priceLabel: '4,90€', imageUrl: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?q=80&w=400&auto=format&fit=crop' },
        { id: 'gurken', name: 'Gurkensalat', icon: 'spa', accentColor: '#2f7d69', priceLabel: '4,50€', imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?q=80&w=400&auto=format&fit=crop' },
        { id: 'kidneybohnen', name: 'Kidneybohnen Salat', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop' },
        { id: 'tomaten', name: 'Tomatensalat', icon: 'spa', accentColor: '#b83e3e', priceLabel: '4,90€', imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=400&auto=format&fit=crop' },
        { id: 'karotten', name: 'Karottensalat', icon: 'spa', accentColor: '#d69f5f', priceLabel: '4,90€', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop' },
        { id: 'paprika', name: 'Paprikasalat', icon: 'local_florist', accentColor: '#b83e3e', priceLabel: '4,90€', imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=400&auto=format&fit=crop' },
        { id: 'brokkoli', name: 'Brokkoli Salat', icon: 'eco', accentColor: '#2f7d69', priceLabel: '5,50€', imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=400&auto=format&fit=crop' },
        { id: 'hirtensalat', name: 'Hirtensalat', icon: 'lunch_dining', accentColor: '#d69f5f', priceLabel: '6,50€', imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'frische-speisen',
      title: 'Frische Speisen',
      icon: 'ramen_dining',
      items: [
        { id: 'suppe', name: 'Suppe', description: 'Täglich frisch zubereitet.', icon: 'soup_kitchen', accentColor: '#b83e3e', priceLabel: '4,90€', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop' },
        { id: 'mittagstisch', name: 'Mittagstisch', description: 'Wechselndes Menü zur Mittagszeit.', icon: 'lunch_dining', accentColor: '#d69f5f', priceLabel: '8,90€', imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400&auto=format&fit=crop' },
        { id: 'antipasti', name: 'Antipasti Teller', icon: 'restaurant_menu', accentColor: '#2f7d69', priceLabel: '8,90€', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
        { id: 'boerek', name: 'Börek', icon: 'bakery_dining', accentColor: '#d69f5f', priceLabel: '3,50€', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop' },
        { id: 'sigara-boerek', name: 'Sigara Börek', icon: 'kebab_dining', accentColor: '#d69f5f', priceLabel: '3,90€', imageUrl: 'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?q=80&w=400&auto=format&fit=crop' },
        { id: 'panini', name: 'Panini', icon: 'lunch_dining', accentColor: '#b83e3e', priceLabel: '5,90€', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&auto=format&fit=crop' },
        { id: 'manti', name: 'Manti (türkische Maultaschen)', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '7,90€', imageUrl: 'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'saft',
      title: 'Frisch gepresster Saft',
      description: 'Erfrischende Säfte, reich an Vitaminen.',
      icon: 'local_drink',
      items: [
        { id: 'safte', name: 'Orange, Apfel, Karotte, Granatapfel u.v.m.', icon: 'local_drink', accentColor: '#b83e3e', priceLabel: '3,50€', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'getraenke',
      title: 'Getränke',
      icon: 'local_cafe',
      items: [
        { id: 'tuerkischer-kaffee', name: 'Türkischer Kaffee', icon: 'local_cafe', accentColor: '#6b4f3a', priceLabel: '2,50€', imageUrl: 'https://images.unsplash.com/photo-1517909215210-95e3772aa5a8?q=80&w=400&auto=format&fit=crop' },
        { id: 'tuerkischer-tee', name: 'Türkischer Tee', icon: 'emoji_food_beverage', accentColor: '#b83e3e', priceLabel: '1,50€', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400&auto=format&fit=crop' },
        { id: 'marokkanischer-tee', name: 'Marokkanischer Tee (Minze Tee)', icon: 'emoji_food_beverage', accentColor: '#2f7d69', priceLabel: '1,90€', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'oel-fruechte',
      title: 'Öl und Früchte',
      items: [
        { id: 'olivenoel', name: 'Qualitäts-Olivenöl', icon: 'opacity', accentColor: '#2f7d69', priceLabel: '6,90€', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop' },
        { id: 'getrocknete-fruechte', name: 'Getrocknete Früchte', icon: 'restaurant', accentColor: '#d69f5f', priceLabel: '3,90€', imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'obst',
      title: 'Täglich Frisches Obst',
      description: 'Saisonale Obst- und Fruchtsorten wie Spargel, Erdbeeren, Orangen, Wassermelone und Trauben.',
      items: [
        { id: 'erdbeeren', name: 'Erdbeeren', icon: 'restaurant', accentColor: '#b83e3e', priceLabel: '2,90€', imageUrl: 'https://images.unsplash.com/photo-1543528176-61b239494933?q=80&w=400&auto=format&fit=crop' },
        { id: 'orangen', name: 'Orangen', icon: 'restaurant', accentColor: '#d69f5f', priceLabel: '2,50€', imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=400&auto=format&fit=crop' },
        { id: 'wassermelone', name: 'Wassermelone', icon: 'restaurant', accentColor: '#2f7d69', priceLabel: '3,90€', imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=400&auto=format&fit=crop' },
        { id: 'trauben', name: 'Trauben', icon: 'restaurant', accentColor: '#6b4f3a', priceLabel: '2,90€', imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'regional',
      title: 'Regionale Produkte',
      items: [
        { id: 'mehl-adlermuehle', name: 'Mehl von Adlermühle', icon: 'bakery_dining', accentColor: '#d69f5f', priceLabel: '2,90€', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
        { id: 'nudeln-breisach', name: 'Handgemachte Nudeln aus Breisach', icon: 'ramen_dining', accentColor: '#2f7d69', priceLabel: '3,90€', imageUrl: 'https://images.unsplash.com/photo-1551462312-ccf071ca3993?q=80&w=400&auto=format&fit=crop' },
        { id: 'saft-jung', name: 'Saft von Firma Jung', icon: 'local_drink', accentColor: '#b83e3e', priceLabel: '1,90€', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&auto=format&fit=crop' },
        { id: 'eier-forchheim', name: 'Freilaufende Eier aus Forchheim', icon: 'egg', accentColor: '#d69f5f', priceLabel: '2,90€', imageUrl: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 'pakete',
      title: 'Pakete & Angebote',
      description: 'Perfekt zum Mitnehmen oder als Geschenk.',
      items: [
        { id: 'fruehstuecks-paket', name: 'Frühstücks-Paket', description: 'Simit/Börek, Aufstriche, Oliven & Käse', icon: 'brunch_dining', accentColor: '#d69f5f', priceLabel: '12,90€', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop' },
        { id: 'mezze-paket', name: 'Mezze-Paket', description: 'Hummus, Baba Ghanoush, Tsatsiki & Antipasti', icon: 'restaurant_menu', accentColor: '#2f7d69', priceLabel: '14,90€', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
        { id: 'catering', name: 'Catering Anfrage', description: 'Individuelle Angebote für Events', icon: 'event', accentColor: '#2f7d69', priceLabel: 'auf Anfrage', tags: ['auf Anfrage'], imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400&auto=format&fit=crop' }
      ]
    }
  ]);

  getCategories() {
    return this.categoriesSignal.asReadonly();
  }
} 