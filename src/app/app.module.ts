import { environment } from '../environments/environment';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ngb68FireauthModule } from '../modules/ngb68-fireauth';
import { Ngb68UtilsModule } from '../modules/ngb68-utils';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { YoutubePlayerModule } from 'ng2-youtube-player/ng2-youtube-player';
import { Ng2PaginationModule } from 'ng2-pagination';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { DropdownModule, PopoverModule } from 'ng2-bootstrap';
import { FirebaseConfigModule } from '../firebase';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components';
import { VideoComponent, VideoService } from './video';
import { AppReducer } from './shared/reducers';
import { SearchResultComponent, SearchResultItemComponent, SearchBoxComponent } from './search';
import { PlaylistEntriesComponent, PlaylistEntryComponent, PlaylistControlComponent, PlaylistLoaderComponent} from './playlist';
import { PlaylistService, Playlist } from './playlist/shared';
import { LoginPageComponent, PlayerPageComponent, NotFoundPageComponent } from './_pages';
import { AppRouterModule } from './app.router';

// -------------------------------------------------------------------

let DEV_MODULES: ModuleWithProviders[] = environment.production ? [] : [
  StoreDevtoolsModule.instrumentOnlyWithExtension()
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
    DragulaModule,
    DropdownModule.forRoot(),
    PopoverModule.forRoot(),
    StoreModule.provideStore(AppReducer),
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
    PlaylistService
  ]
})
export class AppModule { }
