import { Action } from "@ngrx/store";
import { ISearchResultVideo } from "./interfaces";
import * as actions from "./actions";


export function SearchResultReducer(state: ISearchResultVideo[] = [], { type, payload }: Action): ISearchResultVideo[] {
  switch (type) {
    case actions.ACTION_TYPE_SEARCH_RESULT:
      return payload;
    default:
      return state;
  }
}

export function SearchResultPageReducer(state: number = 1, { type, payload }: Action): number {
  switch (type) {
    case actions.ACTION_TYPE_SEARCH_RESULT_PAGE:
      return payload;
    default:
      return state;
  }
}
