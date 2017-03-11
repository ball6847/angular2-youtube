import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { AuthProviders, AuthMethods, AngularFireAuth, FirebaseAuthState } from 'angularfire2';

@Component({
  selector: "firebase-signin",
  template: `<button (click)="signInWithFacebook()" [ngClass]="classes">{{ text }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirebaseSigninComponent {
  /**
   * Typescript 2.1+ cannot use DI with the parent class constructor
   * We need to include the constructor in all child classes
   *
   * @param auth$
   */
  constructor(protected auth$: AngularFireAuth) {}

  /**
   * Default css classes for button
   */
  @Input()
  classes = "btn";

  /**
   * Default button text, should be overrided in derivetive class
   *
   * Example: <firebase-facebook-signin text="Login with Facebook"></firebase-facebook-signin>
   */
  @Input()
  text = 'SignIn';

  /**
   * Event fired when user successfully authenticated
   *
   * Example: <firebase-facebook-signin (authenticated)="router.navigate('[/]')"></firebase-facebook-signin>
   */
  @Output()
  authenticated = new EventEmitter<FirebaseAuthState>();

  /**
   * Event fired when user failed to authenticate
   *
   * Example: <firebase-facebook-signin (error)="showError($event)"></firebase-facebook-signin>
   */
  @Output()
  error = new EventEmitter<FirebaseAuthState>();

  /**
   *  Sign-in anonymously
   */
  signInAnonymously() {
    this.auth$
      .login({
        provider: AuthProviders.Anonymous,
        method: AuthMethods.Anonymous
      })
      .then((state: FirebaseAuthState) => this.authenticated.emit(state))
      .catch(error => this.error.emit(error)); // @TODO: find out which type is passing
  }

  /**
   * Sign-in with Github Account
   */
  signInWithGithub() {
    this._signIn(AuthProviders.Github);
  }

  /**
   * Sign-in with Google Account
   */
  signInWithGoogle() {
    this._signIn(AuthProviders.Google);
  }

  /**
   * Sign-in with Twitter
   */
  signInWithTwitter() {
    this._signIn(AuthProviders.Twitter);
  }

  /**
   *  Sign-in with Facebook
   */
  signInWithFacebook() {
    this._signIn(AuthProviders.Facebook);
  }

  /**
   * internal signin processor
   *
   * @param provider
   */
  protected _signIn(provider: number) {
    this.auth$
      .login({ provider })
      .then((state: FirebaseAuthState) => this.authenticated.emit())
      .catch(error => this.error.emit(error)); // @TODO: find out which type is passing
  }
}
