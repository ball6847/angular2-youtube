import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { Ng2PaginationModule } from "ng2-pagination";
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { DropdownModule, PopoverModule } from 'ng2-bootstrap';
import { AppComponent } from "./app.component";
import { AppService } from "./app.service";
import { HeaderComponent } from "./shared/nav/header/header.component";
import { SearchBoxComponent } from "./shared/nav/search-box/search-box.component";
import { VideoComponent, VideoService } from "./video";
import { SearchResultComponent, SearchResultItemComponent } from "./search"
import {
  PlaylistEntriesComponent,
  PlaylistEntryComponent,
  PlaylistControlComponent,
  PlaylistLoaderComponent,
  PlaylistService
} from "./playlist";


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    Ng2PaginationModule,
    YoutubePlayerModule,
    DragulaModule,
    DropdownModule.forRoot(),
    PopoverModule.forRoot()
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
