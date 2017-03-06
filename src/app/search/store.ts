import { Action } from '@ngrx/store';
import { ISearchResultState, ISearchResultVideo } from "./interfaces";


// -------------------------------------------------------------
// action type

const ACTION_TYPE_SEARCH_RESULT = 'SEARCH_RESULT';
const ACTION_TYPE_SEARCH_RESULT_PAGE = 'SEARCH_RESULT_PAGE';

// -------------------------------------------------------------
// action class

export class SearchResultAction implements Action {
  readonly type = ACTION_TYPE_SEARCH_RESULT;
  readonly payload;
  constructor(videos: ISearchResultVideo[]) {
    this.payload = videos;
  }
}

export class SearchResultPageAction implements Action {
  readonly type = ACTION_TYPE_SEARCH_RESULT_PAGE;
  readonly payload;
  constructor(page: number) {
    this.payload = page;
  }
}

// -------------------------------------------------------------
// reducers

export function SearchResultReducer(state: ISearchResultVideo[] = [], { type, payload }: Action): ISearchResultVideo[] {
  switch (type) {
    case ACTION_TYPE_SEARCH_RESULT:
      return payload;
    default:
      return state;
  }
}

export function SearchResultPageReducer(state: number = 1, { type, payload }: Action): number {
  switch (type) {
    case ACTION_TYPE_SEARCH_RESULT_PAGE:
      return payload;
    default:
      return state;
  }
}