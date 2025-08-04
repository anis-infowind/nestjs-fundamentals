import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';

@Controller('audio')
export class AudioController {
  constructor(
    @InjectQueue('audio-queue')
    private readonly audioQueue: Queue,
  ) {}

  @Post('convert')
  async convert() {
    await this.audioQueue.add('convert', {
      file: 'sample.wav',
      id: 1,
    });
  }
}
