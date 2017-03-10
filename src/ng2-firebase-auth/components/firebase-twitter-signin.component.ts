import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';
import { FirebaseSigninComponent } from './firebase-signin.component';

@Component({
  selector: "firebase-twitter-signin",
  template: `<button (click)="signInWithTwitter()" [ngClass]="classes">{{ text }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseTwitterSigninComponent extends FirebaseSigninComponent {
  @Input() text = 'Sign In with Twitter';

  constructor(auth$: AngularFireAuth) {
    super(auth$);
  }
}
