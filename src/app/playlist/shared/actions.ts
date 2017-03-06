import { Action } from '@ngrx/store';
import { Playlist } from './interfaces';


export const CREATE = 'CREATE';
export const CREATE_FAILED = 'CREATE_FAILED';
export const CREATE_FULFILLED = 'CREATE_FULFILLED';

export const DELETE = 'DELETE';
export const DELETE_FAILED = 'DELETE_FAILED';
export const DELETE_FULFILLED = 'DELETE_FULFILLED';

export const FETCH = 'FETCH';
export const FETCH_FAILED = 'FETCH_FAILED';
export const FETCH_FULFILLED = 'FETCH_FULFILLED';

export const UPDATE = 'UPDATE';
export const UPDATE_FAILED = 'UPDATE_FAILED';
export const UPDATE_FULFILLED = 'UPDATE_FULFILLED';