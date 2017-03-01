import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { AppState } from "./shared/app-state.service";
import { HeaderComponent } from "./shared/nav/header/header.component";
import { SearchBoxComponent } from "./shared/nav/search-box/search-box.component";
import { VideoListComponent } from "./videos/video-list/video-list.component";
import { VideoListItemComponent } from "./videos/video-list-item/video-list-item.component";
import { VideoPlayerComponent } from "./videos/video-player/video-player.component";
import { VideosComponent } from "./videos/videos.component";
import { VideoPlaylistComponent } from "./videos/video-playlist/video-playlist.component";
import { VideoPlaylistControlComponent } from "./videos/video-playlist-control/video-playlist-control.component";
import { VideoPlaylistItemComponent } from "./videos/video-playlist-item/video-playlist-item.component";
import { VideoService } from "./videos/shared/video.service";
import { PlaylistService } from "./videos/shared/playlist.service";
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { Ng2PaginationModule } from "ng2-pagination";
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    Ng2PaginationModule,
    YoutubePlayerModule,
    DragulaModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchBoxComponent,
    VideosComponent,
    VideoListComponent,
    VideoListItemComponent,
    VideoPlayerComponent,
    VideoPlaylistComponent,
    VideoPlaylistControlComponent,
    VideoPlaylistItemComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AppState,
    VideoService,
    PlaylistService
  ]
})
export class AppModule {
}
