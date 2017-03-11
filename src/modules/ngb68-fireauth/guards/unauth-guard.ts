import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';


/**
 * UnauthGuard (service) :
 *
 * Navigate users to your app's landing page if they already authenticated
 * You would generally deploy this guard into login page
 *
 * @todo: find a way to make redirect destination configurable
 */
@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(private auth$: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth$
      .take(1)
      .map(state => !state)
      .do(unauthenticated => {
        if (!unauthenticated) {
          this.router.navigate(['/']);
        }
      });
  }
}
