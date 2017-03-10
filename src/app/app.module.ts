import { environment } from '../environments/environment';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { YoutubePlayerModule } from 'ng2-youtube-player/ng2-youtube-player';
import { Ng2PaginationModule } from 'ng2-pagination';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { DropdownModule, PopoverModule } from 'ng2-bootstrap';
import { SelectMeDirective } from './shared/directives/selectme'; // @TODO: publish npm module
import { FocusMeDirective } from './shared/directives/focusme';
import { FirebaseConfigModule } from '../firebase';
import { FirebaseAuthModule, UnauthGuard, AuthService } from '../ng2-firebase-auth';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components';
import { VideoComponent, VideoService } from './video';
import { AppReducer } from './shared/reducers';
import { SearchResultComponent, SearchResultItemComponent, SearchBoxComponent } from './search';
import { PlaylistEntriesComponent, PlaylistEntryComponent, PlaylistControlComponent, PlaylistLoaderComponent} from './playlist';
import { PlaylistService, Playlist } from './playlist/shared';
import { LoginPageComponent, PlayerPageComponent, NotFoundPageComponent } from './_pages';
import { IfAuthenticated } from './auth/guards/if-authenticated';


const appRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: PlayerPageComponent, pathMatch: 'full', canActivate: [IfAuthenticated] },
  { path: '**', component: NotFoundPageComponent }
];

// -------------------------------------------------------------------

let DEV_MODULES: ModuleWithProviders[] = environment.production ? [] : [
  StoreDevtoolsModule.instrumentOnlyWithExtension()
];

// -------------------------------------------------------------------

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FirebaseConfigModule,
    FirebaseAuthModule,
    Ng2PaginationModule,
    YoutubePlayerModule,
    DragulaModule,
    DropdownModule.forRoot(),
    PopoverModule.forRoot(),
    StoreModule.provideStore(AppReducer),
    RouterModule.forRoot(appRoutes),
    ...DEV_MODULES
  ],
  declarations: [
    SelectMeDirective,
    FocusMeDirective,
    AppComponent,
    HeaderComponent,
    SearchBoxComponent,
    VideoComponent,
    SearchResultComponent,
    SearchResultItemComponent,
    PlaylistEntriesComponent,
    PlaylistEntryComponent,
    PlaylistControlComponent,
    PlaylistLoaderComponent,
    LoginPageComponent,
    PlayerPageComponent,
    NotFoundPageComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AppService,
    VideoService,
    PlaylistService,
    IfAuthenticated
  ]
})
export class AppModule { }
