import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { IconBadgeComponent } from '../../components/icon-badge/icon-badge.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, IconBadgeComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly menuService = inject(MenuService);
  categories = this.menuService.getCategories();
} 