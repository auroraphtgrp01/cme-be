import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueRedisService {
  constructor(
    @InjectQueue('getDistance') private readonly getDistanceQueue: Queue,
    @InjectQueue('getDistanceBetweenLocation')
    private readonly getDistanceBetweenLocationQueue: Queue
  ) {}

  async enqueueGetDistance(job: any): Promise<void> {
    await this.getDistanceQueue.add('getDistance', job);
  }

  async enqueueGetDistanceBetweenLocation(job: any): Promise<void> {
    await this.getDistanceBetweenLocationQueue.add(
      'getDistanceBetweenLocation',
      job
    );
  }
}
