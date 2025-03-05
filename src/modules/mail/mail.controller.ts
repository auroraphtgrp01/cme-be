import { MailService } from "@/modules/mail/mail.service";
import { Controller, Get } from "@nestjs/common";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Get('sendEmail')
  async sendEmail(payload: any) {
    return this.mailService.sendMail(payload)
  }
}
