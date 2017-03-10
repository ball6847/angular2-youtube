import { Component, ChangeDetectionStrategy, Output, EventEmitter} from "@angular/core";
import { AuthProviders, AuthMethods, AngularFireAuth, FirebaseAuthState } from 'angularfire2';

export class FirebaseSigninComponent {
  @Output() authenticated = new EventEmitter<FirebaseAuthState>();
  @Output() error = new EventEmitter<FirebaseAuthState>();

  constructor(public auth$: AngularFireAuth) {}

  signInAnonymously() {
    this.auth$
      .login({
        provider: AuthProviders.Anonymous,
        method: AuthMethods.Anonymous
      })
      .then((state: FirebaseAuthState) => this.authenticated.emit(state))
      .catch(error => this.error.emit(error)); // @TODO: find out which type is passing
  }

  signInWithGithub() {
    this._signIn(AuthProviders.Github);
  }

  signInWithGoogle() {
    this._signIn(AuthProviders.Google);
  }

  signInWithTwitter() {
    this._signIn(AuthProviders.Twitter);
  }

  signInWithFacebook() {
    this._signIn(AuthProviders.Facebook);
  }

  protected _signIn(provider: number) {
    this.auth$
      .login({ provider })
      .then((state: FirebaseAuthState) => this.authenticated.emit())
      .catch(error => this.error.emit(error)); // @TODO: find out which type is passing
  }
}
