import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QueueRedisService } from '@/core/queues/queue-redis.service'
import { QueueProcessorSendEmailService } from '@/core/queues/queue-processor.service'
import { MailService } from '@/modules/mail/mail.service'
import { MailModule } from '@/modules/mail/mail.module'

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue(
      {
        name: 'sendEmail',
        prefix: 'BullQueue_sendEmail'
      },
    ),
  ],
  providers: [QueueRedisService, QueueProcessorSendEmailService],
  exports: [QueueRedisService, QueueProcessorSendEmailService]
})
export class QueueRedisModule { }
