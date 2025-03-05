import { CommentService } from '@/modules/comment/comment.service';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

}
