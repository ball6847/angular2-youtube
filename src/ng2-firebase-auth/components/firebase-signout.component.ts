import { Component, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';

@Component({
  selector: "firebase-signout",
  template: '<button (click)="signOut()" class="btn btn-block btn-danger">Signout</button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseSignoutComponent {
  @Output() success = new EventEmitter();
  @Output() error = new EventEmitter();

  constructor(public auth$: AngularFireAuth) { }

  public signOut() {
    this.auth$.logout()
      .then(() => this.success.emit())
      .catch(() => this.error.emit());
  }
}
