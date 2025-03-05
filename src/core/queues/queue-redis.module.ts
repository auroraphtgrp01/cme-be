import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueRedisService } from '@/core/queues/queue-redis.service';
import {
  QueueProcessorGetDistance,
  QueueProcessorGetDistanceBetweenLocation,
} from '@/core/queues/queue-processor.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'getDistance',
        prefix: 'BullQueue_getDistance',
      },
      {
        name: 'getDistanceBetweenLocation',
        prefix: 'BullQueue_getDistanceBetweenLocation',
      }
    ),
  ],
  providers: [
    QueueRedisService,
    QueueProcessorGetDistance,
    QueueProcessorGetDistanceBetweenLocation,
  ],
  exports: [
    QueueRedisService,
    QueueProcessorGetDistance,
    QueueProcessorGetDistanceBetweenLocation,
  ],
})
export class QueueRedisModule {}
