import { CommentController } from '@/modules/comment/comment.controller';
import { CommentService } from '@/modules/comment/comment.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule { }
