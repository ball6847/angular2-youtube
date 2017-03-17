import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 * This service is workaround for ActivatedRoute service
 * which can only use in component registered with Router
 */
@Injectable()
export class PlaylistOwnerService {

  protected owner$: Observable<string>;

  set(owner$: Observable<string>) {
    this.owner$ = owner$;
  }

  get() {
    return this.owner$;
  }
}
