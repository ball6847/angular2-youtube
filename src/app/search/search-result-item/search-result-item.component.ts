import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { ISearchResultVideo } from "../shared";

@Component({
  selector: "search-result-item",
  styleUrls: ["./search-result-item.component.css"],
  templateUrl: './search-result-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultItemComponent {
  @Input() video: ISearchResultVideo;
  @Output() onItemClick = new EventEmitter<ISearchResultVideo>();
  
  onClick(video: ISearchResultVideo) {
    this.onItemClick.emit(video);
  }
}
