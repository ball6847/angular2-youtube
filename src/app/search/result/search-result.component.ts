import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { AppState } from "../../app.store";
import { PlaylistService } from "../../playlist";
import { Video, VideoService } from "../../video";
import { SearchResultAction, SearchResultPageAction } from "../store";

@Component({
  selector: "search-result",
  styleUrls: ["./search-result.component.css"],
  templateUrl: "./search-result.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultComponent {
  videos$: Observable<Video[]>;
  page$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private videoService: VideoService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.videos$ = this.store.select(state => state.searchResult);
    this.page$ = this.store.select(state => state.searchResultPage);
    
    this.videoService.search()
      .subscribe((videos: Video[]) => {
        this.store.dispatch(new SearchResultAction(videos));
      });
  }

  enqueue(video: Video) {
    this.playlistService.enqueue(video);
  }

  onPageChanged(page: number) {
    this.store.dispatch(new SearchResultPageAction(page));
  }
}
