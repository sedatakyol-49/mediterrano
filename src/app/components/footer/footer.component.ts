import { NgIf } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly site = inject(ContentService);
  readonly settings = this.site.settings;
  readonly year = new Date().getFullYear();
}
