import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, UnauthGuard } from '../modules/ngb68-fireauth' ;
import { LoginPageComponent, PlayerPageComponent, NotFoundPageComponent } from './_pages';


const appRoutes: Routes = [
  { path: 'r/:roomId', component: PlayerPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [UnauthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent }
];


export const AppRouterModule = RouterModule.forRoot(appRoutes, { useHash: true });
