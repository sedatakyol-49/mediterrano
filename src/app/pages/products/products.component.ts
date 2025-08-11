import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { IconBadgeComponent } from '../../components/icon-badge/icon-badge.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, IconBadgeComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly menuService = inject(MenuService);
  categories = this.menuService.getCategories();

  scrollToCategory(categoryId: string) {
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 120; // Account for fixed navbar + toolbar
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
} 