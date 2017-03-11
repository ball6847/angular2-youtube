import { Component, ChangeDetectionStrategy, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: "app",
  template: `
    <router-outlet></router-outlet>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent { }
