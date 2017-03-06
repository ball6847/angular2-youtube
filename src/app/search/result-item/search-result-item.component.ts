import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { Video } from "../../video";

@Component({
  selector: "search-result-item",
  styleUrls: ["./search-result-item.component.css"],
  templateUrl: './search-result-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultItemComponent {
  @Input() video: Video;
  @Output() onEnqueue = new EventEmitter<Video>();

  enqueue(video: Video) {
    this.onEnqueue.emit(video);
  }
}
