import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';
import { FirebaseSigninComponent } from './firebase-signin.component';

@Component({
  selector: "firebase-facebook-signin",
  template: '<button (click)="signIn()" class="btn btn-block btn-primary">SignIn with Facebook</button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseFacebookSigninComponent extends FirebaseSigninComponent {
  constructor(auth$: AngularFireAuth) {
    super(auth$);
  }

  public signIn() {
    this.signInWithFacebook();
  }
}
