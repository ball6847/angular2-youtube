import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { AngularFireAuth } from 'angularfire2';

@Component({
  selector: "firebase-signout",
  template: `<button (click)="signOut()" [ngClass]="classes">{{ text }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseSignoutComponent {
  @Input() text = 'Sign Out';
  @Input() classes = 'btn';
  @Output() success = new EventEmitter();
  @Output() error = new EventEmitter();

  constructor(public auth$: AngularFireAuth) { }

  public signOut() {
    this.auth$.logout()
      .then(() => this.success.emit())
      .catch(() => this.error.emit());
  }
}
