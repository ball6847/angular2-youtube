import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PlaylistOwnerService {

  protected owner$: Observable<number>;

  set(owner$: Observable<number>) {
    this.owner$ = owner$;
  }

  get() {
    return this.owner$;
  }
}
