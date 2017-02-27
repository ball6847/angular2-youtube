import { Injectable } from '@angular/core';
import { AppState } from "../../shared/app-state.service";
import { Video } from "../shared/video.model";
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class PlaylistService {
  // @TODO: use firebase later
  private _items: Video[] = [];
  private _items$ = new ReplaySubject<Video[]>(1);
  private shuffle = false;

  constructor(private appState: AppState) {
  }

  items(): ReplaySubject<Video[]> {
    return this._items$;
  }

  play(video: Video) {
    this.appState.activeVideo = video;
  }

  next() {

  }

  prev() {

  }

  add(video: Video): void {
    this._items.push(video);
    this._notify();
  }

  remove(index: number): void {
    this._items.splice(index, 1);
    this._notify();
  }

  private _notify() {
    this._items$.next(this._items);
  }
}
