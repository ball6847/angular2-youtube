import { Action } from '@ngrx/store';
import { ISearchResultVideo } from "./interfaces";

export const ACTION_TYPE_SEARCH_RESULT = 'SEARCH_RESULT';
export const ACTION_TYPE_SEARCH_RESULT_PAGE = 'SEARCH_RESULT_PAGE';

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