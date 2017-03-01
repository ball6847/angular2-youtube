import { Component, OnInit } from "@angular/core";
import { VideoService } from "../shared/video.service";
import { PlaylistService } from "../shared/playlist.service";
import { Video } from "../shared/video.model";
import * as moment from "moment";
import { AppState } from "../../shared/app-state.service";

@Component({
  selector: 'dl-video-list',
  templateUrl: 'video-list.component.html',
  styleUrls: ['video-list.component.css']
})
export class VideoListComponent implements OnInit {

  videoList: Video[] = [];

  constructor(
    private videoService: VideoService,
    private appState: AppState,
    private playlistService: PlaylistService
  ) { }


  ngOnInit() {
    this.videoService.search('')
      .subscribe(data => {
        this.appState.videoList = data.items.map(item => {
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

  enqueue(video: Video) {
    this.playlistService.enqueue(video);
  }


}
