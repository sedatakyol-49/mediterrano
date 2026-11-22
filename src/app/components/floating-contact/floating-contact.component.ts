import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-floating-contact',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './floating-contact.component.html',
  styleUrl: './floating-contact.component.scss'
})
export class FloatingContactComponent {
  readonly site = inject(ContentService);
}
