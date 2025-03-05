import { FileController } from '@/modules/file/file.controller';
import { FileService } from '@/modules/file/file.service';
import { LessonController } from '@/modules/lesson/lesson.controller';
import { LessonService } from '@/modules/lesson/lesson.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule { }
