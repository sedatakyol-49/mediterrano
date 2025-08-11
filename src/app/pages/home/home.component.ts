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

  defaultImageUrl = 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop';
} 