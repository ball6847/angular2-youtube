import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../ng2-firebase-auth';

@Injectable()
export class IfAuthenticated implements CanActivate {
  constructor(protected auth: AuthService, protected router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.auth$
      .take(1)
      .map(state => state !== null)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      });
  }
}
