import { Component, Input, Output, EventEmitter } from "@angular/core";

import { AppService } from "../../app.service";
import { Video } from "../../video";


@Component({
  selector: 'search-result-item',
  styleUrls: ['./search-result-item.component.css'],
  templateUrl: './search-result-item.component.html'
})
export class SearchResultItemComponent {
  @Input()
  video: Video;

  @Output()
  enqueue = new EventEmitter<Video>();

  constructor(private appService: AppService) { }

  doEnqueue() {
    this.enqueue.emit(this.video);
  }

}
