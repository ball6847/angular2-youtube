import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2';

@Component({
  selector: 'login-page',
  styleUrls: ['./login-page.component.css'],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  constructor(protected router: Router, protected auth$: AngularFireAuth) {}

  gotoPlay() {
    this.auth$
      .take(1)
      .do(auth => this.router.navigate([`/r/${auth.uid}`]))
      .subscribe();
    ;
  }
}
