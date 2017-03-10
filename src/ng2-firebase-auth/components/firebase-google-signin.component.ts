import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';
import { FirebaseSigninComponent } from './firebase-signin.component';

@Component({
  selector: "firebase-google-signin",
  template: '<button (click)="signIn()" class="btn btn-block btn-primary">SignIn with Google</button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseGoogleSigninComponent extends FirebaseSigninComponent {
  constructor(auth$: AngularFireAuth) {
    super(auth$);
  }

  public signIn() {
    this.signInWithGoogle();
  }
}
