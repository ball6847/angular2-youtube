import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, UnauthGuard } from '../modules/ngb68-fireauth' ;
import { LoginPageComponent, PlayerPageComponent, NotFoundPageComponent } from './_pages';


const appRoutes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [UnauthGuard] },
  { path: '', component: PlayerPageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: NotFoundPageComponent }
];


export const AppRouterModule = RouterModule.forRoot(appRoutes, { useHash: true });
