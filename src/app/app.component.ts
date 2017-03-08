import { Component, ChangeDetectionStrategy, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
