import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class Room {
  id: number;
}

@Injectable()
export class RoomService {
  constructor() {

  }
}



@Injectable()
export class RoomResolver implements Resolve<Room> {

  constructor(protected route: ActivatedRouteSnapshot) { }

  resolve() {
    return Observable.of(new Room());
  }
}
