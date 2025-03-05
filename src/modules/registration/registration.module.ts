import { RegistrationController } from '@/modules/registration/registration.controller';
import { RegistrationService } from '@/modules/registration/registration.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule { }
