import { PaymentController } from '@/modules/payment/payment.controller';
import { PaymentService } from '@/modules/payment/payment.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule { }
