import { MailService } from '@/modules/mail/mail.service'
import { WorkerHost, Processor, OnWorkerEvent } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'

@Processor('sendEmail')
export class QueueProcessorSendEmailService extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super()
  }
  private logger = new Logger()
  async process(job: Job<any, string, string>, token?: string) {
    switch (job.name) {
      case 'sendEmail':
        try {
          console.log('Send email', job.data)
          const result = await this.mailService.sendMail(job.data)
          return result
        } catch (error) {
          return error
        }
      default:
        throw new Error('No job name match')
    }
  }

  @OnWorkerEvent('active')
  onQueueActive(job: Job) {
    this.logger.log(`Job has been started: ${job.id}`)
  }

  @OnWorkerEvent('completed')
  onQueueComplete(job: Job, result: any) {
    this.logger.log(`Job has been finished: ${job.id}`)
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any) {
    this.logger.log(`Job has been failed: ${job.id}`)
    this.logger.log({ err })
  }

  @OnWorkerEvent('error')
  onQueueError(err: any) {
    this.logger.log(`Job has got error: `)
    this.logger.log({ err })
  }
}
