import { Component, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly site = inject(ContentService);
  readonly settings = this.site.settings;
  readonly favourites = computed(() =>
    this.site.products().filter((product) => product.featured),
  );
  readonly deliSelection = computed(() =>
    this.site.products().filter((product) => product.deli),
  );
  readonly breakfastSelection = computed(() =>
    this.site.products().filter((product) => product.breakfast),
  );
}
