import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

@Injectable()
export class QueueRedisService {
  constructor(
    @InjectQueue('sendEmail') private readonly sendEmailQueue: Queue,
  ) { }

  enqueuesendEmail(job: any) {
    this.sendEmailQueue.add('sendEmail', job)
  }
}
