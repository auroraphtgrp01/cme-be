import { QuizController } from '@/modules/quiz/quiz.controller';
import { QuizService } from '@/modules/quiz/quiz.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule { }
