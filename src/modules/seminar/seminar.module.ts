import { SeminarController } from '@/modules/seminar/seminar.controller';
import { SeminarService } from '@/modules/seminar/seminar.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SeminarController],
  providers: [SeminarService],
  exports: [SeminarService],
})
export class SeminarModule { }
