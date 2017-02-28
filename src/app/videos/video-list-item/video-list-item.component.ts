import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Video } from "../shared";
import { AppState } from "../../shared/app-state.service";

@Component({
  selector: 'dl-video-list-item',
  templateUrl: 'video-list-item.component.html',
  styleUrls: ['video-list-item.component.css']
})
export class VideoListItemComponent {
  @Input()
  video: Video;

  @Output()
  enqueue = new EventEmitter<Video>();

  constructor(private appState: AppState) { }

  doEnqueue() {
    this.enqueue.emit(this.video);
  }

}
