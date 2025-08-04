import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  constructor(
    private eventEmitter: EventEmitter2
  ) {
    super();
  }
  private logger = new Logger(AudioProcessor.name);

  async process(job: Job) {
    this.logger.debug('start converting wav file to mp3');
    this.logger.debug(job.data);
    this.logger.debug('file converted successfully');
    this.eventEmitter.emit('audio.converted', job.data);
  }

}