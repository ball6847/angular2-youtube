import { Component, ChangeDetectionStrategy, Output, EventEmitter} from "@angular/core";
import { AuthService } from '../../../ng2-firebase-auth';
import { AngularFireAuth } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: "authentication",
  templateUrl: './authentication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  auth$: AngularFireAuth;

  @Output() authenticated = new EventEmitter();

  constructor(protected _auth: AuthService) {
    this.auth$ = this._auth.auth$;
  }

  public signInWithFacebook() {
    this._auth.signInWithFacebook()
      .then(state => {
        this.authenticated.emit(state)
      });
  }

  public signOut() {
    this._auth.signOut();
  }
}
