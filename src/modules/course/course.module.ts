import { CourseController } from '@/modules/course/course.controller';
import { CourseService } from '@/modules/course/course.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule { }
