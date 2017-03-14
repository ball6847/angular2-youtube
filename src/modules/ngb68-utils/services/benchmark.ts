import { Injectable } from '@angular/core';

@Injectable()
export class BenchmarkService {
  /**
   * Elapsed Time Pool, contain timstamp recorded at start() called
   */
  elapsedTime = {};

  /**
   * Set checkpoint and start timer
   *
   * @param checkpoint
   */
  start(checkpoint: string) {
    this.elapsedTime[checkpoint] = (new Date()).getTime();
  }

  /**
   * Stop timer and return elapsed time
   *
   * @param checkpoint
   */
  stop(checkpoint: string) {
    if (!this.elapsedTime[checkpoint])
      return 0;

    const elapsed = (new Date()).getTime() - this.elapsedTime[checkpoint];

    return elapsed / 1000;
  }
}

