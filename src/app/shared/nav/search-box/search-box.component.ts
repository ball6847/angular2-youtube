import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs/Subject";
import { AppState } from "../../../app.store";
import { Video, VideoService } from "../../../video";
import { SearchResultAction } from "../../../search/store";

@Component({
  selector: "search-box",
  styleUrls: ["./search-box.component.css"],
  templateUrl: "./search-box.component.html"
})
export class SearchBoxComponent {
  searchTerm$ = new Subject<string>();

  constructor(private store: Store<AppState>, private videoService: VideoService) {}

  ngOnInit() {
    this.videoService.rxSearch(this.searchTerm$)
      .subscribe((videos: Video[]) => {
        this.store.dispatch(new SearchResultAction(videos));
      });
  }
}
