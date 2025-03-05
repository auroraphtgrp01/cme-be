import { LessonController } from '@/modules/lesson/lesson.controller';
import { LessonService } from '@/modules/lesson/lesson.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule { }
