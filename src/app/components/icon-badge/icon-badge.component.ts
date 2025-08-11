import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-badge',
  standalone: true,
  template: `
    <div class="icon-badge" [style.--badge-color]="color">
      <span class="material-symbols-rounded">{{ icon }}</span>
    </div>
  `,
  styleUrls: ['./icon-badge.component.scss']
})
export class IconBadgeComponent {
  @Input() icon: string = 'star';
  @Input() color: string = '#2f7d69';
} 