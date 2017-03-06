import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs/Subject";
import { Video, VideoService } from "../../video";
import { SearchResultAction, ISearchResultState } from "../shared";

@Component({
  selector: "search-box",
  styleUrls: ["./search-box.component.css"],
  templateUrl: "./search-box.component.html"
})
export class SearchBoxComponent {
  searchTerm$ = new Subject<string>();

  constructor(private store: Store<ISearchResultState>, private videoService: VideoService) {}

  ngOnInit() {
    this.videoService.rxSearch(this.searchTerm$)
      .subscribe((videos: Video[]) => {
        this.store.dispatch(new SearchResultAction(videos));
      });
  }
}
