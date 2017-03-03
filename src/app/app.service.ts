import { Injectable } from "@angular/core";

import { Video } from "./video";


@Injectable()
export class AppService {
  videoList: Video[] = [];
  activeVideo: Video;
  player: YT.Player;
  search = {
    page: 1
  };
}
