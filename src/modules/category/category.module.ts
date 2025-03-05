import { CategoryController } from '@/modules/category/category.controller';
import { CategoryService } from '@/modules/category/category.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule { }
