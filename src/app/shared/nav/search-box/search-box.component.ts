import { Component } from "@angular/core";
import { VideoService } from "../../../videos/shared/video.service";
import { AppState } from "../../app-state.service";
import { Video } from "../../../videos/shared/video.model";
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

@Component({
  selector: 'dl-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.css']
})
export class SearchBoxComponent {
  searchTerm$ = new Subject<string>();

  constructor(private videoService: VideoService, private appState: AppState) { }

  ngOnInit() {
    this.videoService.rxSearch(this.searchTerm$)
      .subscribe(data => {
        this.appState.search.page = 1;
        this.appState.videoList = data.items.map(item => {
          return new Video(
            item.id.videoId,
            item.snippet.title,
            item.snippet.thumbnails.high.url,
            item.snippet.channelTitle,
            item.snippet.channelId,
            moment(item.snippet.publishedAt).fromNow(),
            item.snippet.description);
        });
      });
  }
}
