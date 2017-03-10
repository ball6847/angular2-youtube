import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth-guard';
import { UnauthGuard } from './guards/unauth-guard';
import { AuthService } from './services/auth-service';
import {
  FirebaseFacebookSigninComponent,
  FirebaseGithubSigninComponent,
  FirebaseGoogleSigninComponent,
  FirebaseTwitterSigninComponent,
  FirebaseSignoutComponent
} from './components';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FirebaseFacebookSigninComponent,
    FirebaseGithubSigninComponent,
    FirebaseGoogleSigninComponent,
    FirebaseTwitterSigninComponent,
    FirebaseSignoutComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    UnauthGuard
  ],
  exports: [
    FirebaseFacebookSigninComponent,
    FirebaseGithubSigninComponent,
    FirebaseGoogleSigninComponent,
    FirebaseTwitterSigninComponent,
    FirebaseSignoutComponent
  ]
})
export class FirebaseAuthModule {}

export { AuthService };
export { AuthGuard };
export { UnauthGuard };
