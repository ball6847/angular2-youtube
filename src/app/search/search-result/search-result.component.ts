import { Component, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import {
  SearchResultPageAction,
  SearchResultAction,
  ISearchResultState,
  ISearchResultVideo
} from "../shared";

// @TODO: move to shared service, create YoutubeAPIModule
import { VideoService } from "../../video/shared";

// @TODO: maybe use store.dispatch and let the service subcribe for its changes, but we will need PlaylistEnqueueEntryAction instead?
import { PlaylistService } from "../../playlist/shared"


@Component({
  selector: "search-result",
  styleUrls: ["./search-result.component.css"],
  templateUrl: "./search-result.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultComponent {
  videos$: Observable<ISearchResultVideo[]>;
  page$: Observable<number>;

  constructor(
    private store: Store<ISearchResultState>,
    private videoService: VideoService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.videos$ = this.store.select(state => state.searchResult);
    this.page$ = this.store.select(state => state.searchResultPage);

    this.videoService.search()
      .subscribe((videos: ISearchResultVideo[]) => {
        this.store.dispatch(new SearchResultAction(videos));
      });
  }

  enqueue(video) {
    this.playlistService.enqueue(video);
  }

  onPageChanged(page: number) {
    this.store.dispatch(new SearchResultPageAction(page));
  }
}
