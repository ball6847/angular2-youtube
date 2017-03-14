import { environment } from '../environments/environment';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ngb68FireauthModule } from '../modules/ngb68-fireauth';
import { Ngb68UtilsModule } from '../modules/ngb68-utils';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Ng2PaginationModule } from 'ng2-pagination';
import { YoutubePlayerModule } from 'ng2-youtube-player/ng2-youtube-player';
import { FirebaseConfigModule } from '../firebase';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components';
import { VideoComponent, VideoService } from './video';
import { AppReducer } from './shared/reducers';
import { SearchResultComponent, SearchResultItemComponent, SearchBoxComponent } from './search';
import { LoginPageComponent, PlayerPageComponent, NotFoundPageComponent } from './_pages';
import { AppRouterModule } from './app.router';
import { PlaylistModule } from './playlist';
import { EffectsModule } from '@ngrx/effects';
import {
  PlaylistListEffects,
  ActivePlaylistEffects,
  PlaylistEntriesEffects
} from './playlist/stores';



// -------------------------------------------------------------------

let DEV_MODULES: ModuleWithProviders[] = environment.production ? [] : [
  // StoreDevtoolsModule.instrumentOnlyWithExtension()
];

// -------------------------------------------------------------------

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    Ngb68FireauthModule,
    Ngb68UtilsModule,
    FirebaseConfigModule,
    Ng2PaginationModule,
    YoutubePlayerModule,
    StoreModule.provideStore(AppReducer),
    EffectsModule.run(PlaylistListEffects),
    EffectsModule.run(ActivePlaylistEffects),
    EffectsModule.run(PlaylistEntriesEffects),
    PlaylistModule,
    AppRouterModule,
    ...DEV_MODULES
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchBoxComponent,
    VideoComponent,
    SearchResultComponent,
    SearchResultItemComponent,
    LoginPageComponent,
    PlayerPageComponent,
    NotFoundPageComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AppService,
    VideoService
  ]
})
export class AppModule { }
