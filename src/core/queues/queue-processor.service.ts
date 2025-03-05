import { WorkerHost, Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('getDistance')
export class QueueProcessorGetDistance extends WorkerHost {
  // constructor(private readonly staffService: any) {
  //   super();
  // }
  private logger = new Logger();
  async process(job: Job<any, string, string>): Promise<any> {
    switch (job.name) {
      case 'getDistance':
        try {
          // const result = await this.staffService.syncDistance(job.data);
          // return result;
        } catch (error) {
          return error;
        }
      default:
        throw new Error('No job name match');
    }
  }

  @OnWorkerEvent('active')
  onQueueActive(job: Job): void {
    this.logger.log(`Job has been started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onQueueComplete(job: Job): void {
    this.logger.log(`Job has been finished: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any): void {
    this.logger.log(`Job has been failed: ${job.id}`);
    this.logger.log({ err });
  }

  @OnWorkerEvent('error')
  onQueueError(err: any): void {
    this.logger.log(`Job has got error: `);
    this.logger.log({ err });
  }
}

@Processor('getDistanceBetweenLocation')
export class QueueProcessorGetDistanceBetweenLocation extends WorkerHost {
  // constructor(private readonly workLocationService: any) {
  //   super();
  // }

  async process(job: Job<any, string, string>): Promise<any> {
    switch (job.name) {
      case 'getDistanceBetweenLocation':
        try {
          console.log('job.data', job.data);
          // const result =
          //   await this.workLocationService.syncDistanceBetweenLocation(
          //     job.data
          //   );
          // return result;
        } catch (error) {
          return error;
        }
      default:
        throw new Error('No job name match');
    }
  }
}
