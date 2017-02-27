import { Component, Input } from "@angular/core";
import { Video } from "../shared";
import { AppState } from "../../shared/app-state.service";
import { PlaylistService } from "../shared/playlist.service";

@Component({
  selector: 'dl-video-list-item',
  templateUrl: 'video-list-item.component.html',
  styleUrls: ['video-list-item.component.css']
})
export class VideoListItemComponent {
  @Input()
  video: Video;

  constructor(private appState: AppState, private playlist: PlaylistService) { }

  onClick() {
    this.playlist.add(this.video);
    // this.appState.activeVideo = this.video;
  }

}
