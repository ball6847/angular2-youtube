import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';
import { FirebaseSigninComponent } from './firebase-signin.component';

@Component({
  selector: "firebase-google-signin",
  template: `<button (click)="signInWithGoogle()" [ngClass]="classes">{{ text }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseGoogleSigninComponent extends FirebaseSigninComponent {
  @Input() text = 'Sign In with Google';

  constructor(auth$: AngularFireAuth) {
    super(auth$);
  }
}
