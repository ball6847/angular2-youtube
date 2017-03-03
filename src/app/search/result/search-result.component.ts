import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

import { AppService } from "../../app.service";
import { PlaylistService } from "../../playlist";
import { Video, VideoService } from "../../video";


@Component({
  selector: 'search-result',
  styleUrls: ['./search-result.component.css'],
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent implements OnInit {

  videoList: Video[] = [];

  constructor(
    private videoService: VideoService,
    private appService: AppService,
    private playlistService: PlaylistService
  ) { }


  ngOnInit() {
    this.videoService.search('')
      .subscribe(data => {
        this.appService.videoList = data.items.map(item => {
          return new Video(
            item.id.videoId,
            item.snippet.title,
            item.snippet.thumbnails.high.url,
            item.snippet.channelTitle,
            item.snippet.channelId,
            moment(item.snippet.publishedAt).fromNow(),
            item.snippet.description)
        });
      });
  }

  onPageChanged(page) {
    this.appService.search.page = page;
  }

  enqueue(video: Video) {
    this.playlistService.enqueue(video);
  }
}
