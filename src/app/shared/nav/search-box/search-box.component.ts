import { Component } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

import { AppService } from "../../../app.service";
import { Video, VideoService } from "../../../video";

@Component({
  selector: 'dl-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.css']
})
export class SearchBoxComponent {
  searchTerm$ = new Subject<string>();

  constructor(
    private appService: AppService,
    private videoService: VideoService
  ) { }

  ngOnInit() {
    this.videoService.rxSearch(this.searchTerm$)
      .subscribe(data => {
        this.appService.search.page = 1;
        this.appService.videoList = data.items.map(item => {
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
