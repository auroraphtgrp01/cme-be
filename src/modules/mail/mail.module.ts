import { Global, Module } from '@nestjs/common'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { MailerModule } from '@nestjs-modules/mailer'
import * as path from 'path'
import { ConfigService } from '@nestjs/config'
import { MailService } from '@/modules/mail/mail.service'
import { MailController } from '@/modules/mail/mail.controller'

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'codevjp001@gmail.com',
            pass: 'qurr ulsq esyl zhwb'
          }
        },
        template: {
          dir: path.join(process.cwd(), 'src/mail/templates'),
          adapter: new HandlebarsAdapter()
        },
        defaults: {
          from: 'No Reply'
        },
        options: {
          strict: false
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule { }
