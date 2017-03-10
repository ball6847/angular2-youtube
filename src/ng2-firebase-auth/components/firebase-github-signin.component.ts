import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';
import { FirebaseSigninComponent } from './firebase-signin.component';

@Component({
  selector: "firebase-github-signin",
  template: `<button (click)="signInWithGithub()" [ngClass]="classes">{{ text }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseGithubSigninComponent extends FirebaseSigninComponent {
  @Input() text = 'Sign In with Github';

  constructor(auth$: AngularFireAuth) {
    super(auth$);
  }
}
