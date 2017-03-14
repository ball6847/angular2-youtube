import * as moment from "moment";

export class VideoDuration {
  text: string = '0.00';
  seconds: number = 0;
}


// @TODO: remove moment and use angular2-moment directive instead
export class Video {
  // unique id, to identify playlist items
  uuid: string;
  ordering: number = 0;
  duration: VideoDuration;
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  description: string;


  constructor(youtube?) {
    if (youtube) {
      this.videoId = youtube.id.videoId;
      this.title = youtube.snippet.title;
      this.thumbnailUrl = youtube.snippet.thumbnails.high.url;
      this.channelTitle = youtube.snippet.channelTitle;
      this.channelId = youtube.snippet.channelId;
      this.publishedAt = moment(youtube.snippet.publishedAt).fromNow();
      this.description = youtube.snippet.description;
    }
  }
}
