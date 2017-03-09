import { Component, ChangeDetectionStrategy, ViewEncapsulation } from "@angular/core";
import { AuthService } from '../ng2-firebase-auth';
import { AngularFireAuth , FirebaseAuthState } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: "app",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  ready$ = new BehaviorSubject<boolean>(false);

  constructor(private auth: AuthService, private auth$: AngularFireAuth) {
    this.auth$.subscribe(state => {
      this.ready$.next(true);
    });
  }

  public signInWithFacebook() {
    this.auth.signInWithFacebook();
  }

  public signOut() {
    this.auth.signOut();
  }
}
