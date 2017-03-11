import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';
import { FirebaseSigninComponent } from './firebase-signin.component';

@Component({
  selector: "firebase-facebook-signin",
  template: `<button (click)="signInWithFacebook()" [ngClass]="classes">{{ text }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseFacebookSigninComponent extends FirebaseSigninComponent {
  @Input() text = 'Sign In with Facebook';

  constructor(auth$: AngularFireAuth) {
    super(auth$);
  }
}

