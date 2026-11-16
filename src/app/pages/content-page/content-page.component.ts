import { Component, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-content-page',
  standalone: true,
  template: '<article class="managed-page" [innerHTML]="pageBody"></article>',
  styleUrl: './content-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ContentPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  get pageBody(): string {
    const id = this.route.snapshot.data['pageId'] as string;
    return (
      this.content.content().pages.find((page) => page.id === id)?.body ?? ''
    );
  }
}
