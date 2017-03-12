import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistService } from './services';
import { ActivePlaylistService, PlaylistListService } from './stores';
import { PlaylistControlComponent, PlaylistEntriesComponent, PlaylistEntryComponent, PlaylistLoaderComponent } from './components';
import { YoutubePlayerModule } from 'ng2-youtube-player/ng2-youtube-player';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { DropdownModule, PopoverModule } from 'ng2-bootstrap';

const COMPONENTS = [
  PlaylistControlComponent,
  PlaylistEntriesComponent,
  PlaylistEntryComponent,
  PlaylistLoaderComponent
];

const SERVICES = [
  PlaylistService,
  ActivePlaylistService,
  PlaylistListService
];


@NgModule({
  imports: [
    CommonModule,
    YoutubePlayerModule,
    DragulaModule,
    DropdownModule.forRoot(),
    PopoverModule.forRoot()
  ],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
  exports: [...COMPONENTS]
})
export class PlaylistModule { }

export {
  PlaylistService,
  ActivePlaylistService,
  PlaylistListService
};
