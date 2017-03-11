import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'not-found-page',
  styleUrls: ['./not-found-page.component.css'],
  templateUrl: './not-found-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {
  constructor(protected router: Router) {}
}
