import { Component, inject, computed } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { IconBadgeComponent } from '../../components/icon-badge/icon-badge.component';

@Component({
  selector: 'app-mittags-menue',
  standalone: true,
  imports: [CommonModule, IconBadgeComponent],
  template: `
    <section class="page-hero">
      <h1>Mittags Menü</h1>
      <p>Täglich wechselnde Mittagsgerichte</p>
    </section>

    <section class="container">
      <div class="categories" *ngIf="categories().length">
        <div class="category" *ngFor="let cat of categories()" [attr.id]="cat.id">
          <div class="category-header">
            <h2>{{ cat.title }}</h2>
            <p class="category__desc" *ngIf="cat.description">{{ cat.description }}</p>
          </div>
          
          <div class="items">
            <div class="item" *ngFor="let item of cat.items">
              <div class="item__image" *ngIf="item.imageUrl">
                <img [src]="item.imageUrl" [alt]="item.name" loading="lazy">
              </div>
              <div class="item__content">
                <div class="item__top">
                  <div class="item__icon" *ngIf="!item.imageUrl">
                    <app-icon-badge [icon]="item.icon || 'restaurant'" [color]="item.accentColor || '#2f7d69'"></app-icon-badge>
                  </div>
                  <div class="item__info" [class.with-image]="item.imageUrl">
                    <h3>{{ item.name }}</h3>
                    <p *ngIf="item.description">{{ item.description }}</p>
                    <div class="tags" *ngIf="item.tags?.length">
                      <span class="tag" *ngFor="let t of item.tags">{{ t }}</span>
                    </div>
                  </div>
                </div>
                <div class="item__footer" *ngIf="item.priceLabel">
                  <span class="price">{{ item.priceLabel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, #2f7d69 0%, #d69f5f 100%);
      color: white;
      text-align: center;
      padding: 4rem 1rem;
    }
    
    .page-hero h1 {
      font-size: 2.5rem;
      margin: 0 0 1rem;
      font-weight: 700;
    }
    
    .page-hero p {
      font-size: 1.2rem;
      margin: 0;
      opacity: 0.9;
    }
    
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 1rem;
    }
    
    .categories {
      display: grid;
      gap: 3rem;
    }
    
    .category-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .category-header h2 {
      font-size: 2rem;
      color: #2f7d69;
      margin: 0 0 0.5rem;
      font-weight: 600;
    }
    
    .category__desc {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .items {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
    
    .item {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .item__image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .item__content {
      padding: 1.5rem;
    }
    
    .item__top {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .item__info {
      flex: 1;
    }
    
    .item__info.with-image {
      margin-left: 0;
    }
    
    .item__info h3 {
      font-size: 1.3rem;
      color: #333;
      margin: 0 0 0.5rem;
      font-weight: 600;
    }
    
    .item__info p {
      color: #666;
      margin: 0 0 0.5rem;
      line-height: 1.5;
    }
    
    .tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .tag {
      background: #f0f0f0;
      color: #666;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .item__footer {
      border-top: 1px solid #eee;
      padding-top: 1rem;
      margin-top: 1rem;
    }
    
    .price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2f7d69;
    }
    
    @media (max-width: 768px) {
      .page-hero h1 {
        font-size: 2rem;
      }
      
      .items {
        grid-template-columns: 1fr;
      }
      
      .item__top {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class MittagsMenueComponent {
  private menuService = inject(MenuService);
  
  categories = computed(() => 
    this.menuService.getCategories()().filter(cat => cat.id === 'mittags-menue')
  );
}
