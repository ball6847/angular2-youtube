import { Component, ChangeDetectionStrategy, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app",
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent { }
