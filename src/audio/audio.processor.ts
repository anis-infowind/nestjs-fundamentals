import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  private logger = new Logger(AudioProcessor.name);

  async process(job: Job) {
    this.logger.debug('start converting wav file to mp3');
    this.logger.debug(job.data);
    this.logger.debug('file converted successfully');
  }

}