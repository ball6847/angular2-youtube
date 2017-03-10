import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  styleUrls: ['./login-page.component.css'],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  constructor(protected router: Router) {}

  gotoPlay() {
    this.router.navigate(['/']);
  }
}
