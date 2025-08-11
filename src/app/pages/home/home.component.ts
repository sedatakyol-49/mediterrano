import { Component, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { IconBadgeComponent } from '../../components/icon-badge/icon-badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, IconBadgeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly menuService = inject(MenuService);
  categories = this.menuService.getCategories();

  heroTitle = 'Übersicht über unser Sortiment';
  heroSubtitle = 'In unserem Laden bieten wir eine Vielfalt an hochwertigen und regionalen Produkten, die sowohl Feinschmecker als auch gesundheitsbewusste Kunden ansprechen.';

  // Jede Kategorie auf maximal 3 Items begrenzen
  limitedCategories = computed(() => 
    this.categories().map(cat => ({
      ...cat,
      items: cat.items.slice(0, 3)
    }))
  );
} 