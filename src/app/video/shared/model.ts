
interface VideoDuration {
  text: string,
  seconds: number
}

export class Video {
  duration: VideoDuration;
  playing: boolean = false;
  uuid: string;

  constructor(
    public videoId: string,
    public title: string,
    public thumbnailUrl: string,
    public channelTitle: string,
    public channelId: string,
    public publishedAt: string,
    public description: string
  ) {
    this.videoId = videoId;
    this.title = title;
    this.thumbnailUrl = thumbnailUrl;
    this.channelTitle = channelTitle;
    this.channelId = channelId;
    this.publishedAt = publishedAt;
    this.description = description;
  };
}
