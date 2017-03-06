
export interface ISearchResultState {
  searchResult: ISearchResultVideo[];
  searchResultPage: number;
}

export interface ISearchResultVideo {
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  description: string;
}