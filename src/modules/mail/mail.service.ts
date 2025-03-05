import { IMailSenderPayload } from '@/common/types/mail.type';
import { EMailType, IEmailVerifyPayload, IOrderSuccessPayload } from '@/modules/mail/config/mail.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) { }
  async sendMail(payload: IMailSenderPayload) {
    try {
      const payloadToSendMail = await this.getContentMail(payload as any);
      console.log(payload)
      await this.mailerService.sendMail(payloadToSendMail);
      return true;
    } catch (error) {
      console.log('Error send mail', error);
    }
  }

  private async getContentMail(
    payload: IEmailVerifyPayload & IOrderSuccessPayload
  ) {
    const { types, emailReceiver, nameOfReceiver, registration_date, verification_url, order_date, order_id, payment_method, courseLink } = payload;
    switch (types) {
      case EMailType.VERIFY_EMAIL: {

        const payloadSendEmail = {
          to: emailReceiver,
          template: EMailType.VERIFY_EMAIL.toString(),
          subject: 'Hoclientuc.vn - Xác thực tài khoản',
          context: {
            full_name: nameOfReceiver,
            email: emailReceiver,
            registration_date,
            verification_url
          },
        };
        return payloadSendEmail;
      }
      case EMailType.ORDER_SUCCESS: {
        const payloadSendEmail = {
          to: emailReceiver,
          template: EMailType.ORDER_SUCCESS.toString(),
          subject: 'Hoclientuc.vn - Mua khoá học thành công',
          context: {
            full_name: nameOfReceiver,
            email: emailReceiver,
            order_id: order_id,
            order_date: order_date,
            payment_method: payment_method,
            link: courseLink
          },
        };
        return payloadSendEmail
      }
    }
  }
}
