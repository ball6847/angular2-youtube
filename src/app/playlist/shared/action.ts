import { Action } from '@ngrx/store';
import { Playlist } from './model';


export class PlaylistAction {
  static CREATE = 'CREATE';
  static CREATE_FAILED = 'CREATE_FAILED';
  static CREATE_FULFILLED = 'CREATE_FULFILLED';

  static DELETE = 'DELETE';
  static DELETE_FAILED = 'DELETE_FAILED';
  static DELETE_FULFILLED = 'DELETE_FULFILLED';

  static FETCH = 'FETCH';
  static FETCH_FAILED = 'FETCH_FAILED';
  static FETCH_FULFILLED = 'FETCH_FULFILLED';

  static UPDATE = 'UPDATE';
  static UPDATE_FAILED = 'UPDATE_FAILED';
  static UPDATE_FULFILLED = 'UPDATE_FULFILLED';

}
