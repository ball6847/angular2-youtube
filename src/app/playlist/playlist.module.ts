import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistService } from './services';
import { PlaylistControlComponent, PlaylistEntriesComponent, PlaylistEntryComponent, PlaylistLoaderComponent } from './components';
import { YoutubePlayerModule } from 'ng2-youtube-player/ng2-youtube-player';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { DropdownModule, PopoverModule } from 'ng2-bootstrap';
import {
  ActivePlaylistService,
  PlaylistListService,
  PlaylistStateService,
  PlaylistListApiService,
  ActivePlaylistApiService,
  PlaylistEntriesApiService
} from './stores';

const COMPONENTS = [
  PlaylistControlComponent,
  PlaylistEntriesComponent,
  PlaylistEntryComponent,
  PlaylistLoaderComponent
];

const SERVICES = [
  PlaylistService,
  ActivePlaylistService,
  PlaylistListService,
  PlaylistStateService,
  PlaylistListApiService,
  ActivePlaylistApiService,
  PlaylistEntriesApiService
];



@NgModule({
  imports: [
    CommonModule,
    YoutubePlayerModule,
    DragulaModule,
    DropdownModule.forRoot(),
    PopoverModule.forRoot(),
    // StoreModule.provideStore(PlaylistReducer),
  ],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
  exports: [...COMPONENTS]
})
export class PlaylistModule { }

export {
  PlaylistService,
  ActivePlaylistService,
  PlaylistListService,
  PlaylistStateService
};
