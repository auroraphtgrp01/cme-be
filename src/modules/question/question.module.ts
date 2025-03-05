import { QuestionService } from '@/modules/question/question.service';
import { QuestionController } from '@/modules/question/question.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule { }
