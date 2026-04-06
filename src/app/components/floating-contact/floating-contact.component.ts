import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-floating-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './floating-contact.component.html',
  styleUrl: './floating-contact.component.scss'
})
export class FloatingContactComponent {
  readonly phoneNumber = '076419621359';
  readonly whatsappNumber = '49176419621359';
  readonly emailAddress = 'info@mediterrano-em.de';
}
