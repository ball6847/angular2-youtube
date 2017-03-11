import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

/**
 * AuthGuard (service) :
 *
 * Navigate users to your app's login page if they are not authenticated
 * You would generally deploy this guard to page where features might avaiable to authenticated users only
 *
 * @todo: find a way to make redirect destination configurable
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth$: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth$
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      });
  }
}
