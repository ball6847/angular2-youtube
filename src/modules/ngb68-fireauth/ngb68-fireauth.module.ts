import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, UnauthGuard } from './guards';
import { AngularFireModule } from 'angularfire2';
import {
  FirebaseFacebookSigninComponent,
  FirebaseGithubSigninComponent,
  FirebaseGoogleSigninComponent,
  FirebaseTwitterSigninComponent,
  FirebaseSignoutComponent,
  FirebaseSigninComponent
} from './components';


const COMPONENTS = [
  FirebaseFacebookSigninComponent,
  FirebaseGithubSigninComponent,
  FirebaseGoogleSigninComponent,
  FirebaseTwitterSigninComponent,
  FirebaseSignoutComponent,
  FirebaseSigninComponent
];


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    AuthGuard,
    UnauthGuard
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class Ngb68FireauthModule {}
