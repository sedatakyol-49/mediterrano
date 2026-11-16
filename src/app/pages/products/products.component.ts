import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ContentService } from '../../services/content.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  readonly site = inject(ContentService);
  readonly categories = this.site.categories;
  readonly settings = this.site.settings;
}
