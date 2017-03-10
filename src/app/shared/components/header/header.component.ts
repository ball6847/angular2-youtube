import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2';

@Component({
  selector: 'dl-header',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private auth$;

  constructor(auth: AngularFireAuth, private router: Router) {
    this.auth$ = auth;
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
