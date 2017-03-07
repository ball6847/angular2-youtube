import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { YoutubePlayerModule } from 'ng2-youtube-player/ng2-youtube-player';
import { Ng2PaginationModule } from 'ng2-pagination';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { DropdownModule, PopoverModule } from 'ng2-bootstrap';

// @TODO: publish npm module
import { SelectMeDirective } from './shared/directives/selectme';
import { FocusMeDirective } from './shared/directives/focusme';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HeaderComponent } from './shared/nav/header/header.component';
import { VideoComponent, VideoService } from './video';

import {
  SearchResultComponent,
  SearchResultItemComponent,
  SearchBoxComponent
} from './search';

import {
  PlaylistEntriesComponent,
  PlaylistEntryComponent,
  PlaylistControlComponent,
  PlaylistLoaderComponent,
  PlaylistService,
  Playlist
} from './playlist';

import { AppReducer } from './shared/reducers';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    Ng2PaginationModule,
    YoutubePlayerModule,
    DragulaModule,
    DropdownModule.forRoot(),
    PopoverModule.forRoot(),
    StoreModule.provideStore(AppReducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
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
