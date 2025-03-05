import { Public } from '@/common/decorators/isPublicRoute';
import { UserInfo } from '@/common/decorators/users.decorator';
import { ChangePasswordDto } from '@/core/auth/dto/create-auth.dto';
import { CategoryService } from '@/modules/category/category.service';
import { CreateCategoryDto, GetCategoryByType, UpdateCategoryDto } from '@/modules/category/dto/category.dto';
import { RegisterUserDto, UpdateUserDto, ValidateUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import { UserService } from '@/modules/users/users.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto)
  }

  @Public()
  @Get()
  findAll(@Query() type: GetCategoryByType) {
    return this.categoryService.findAll(type)
  }

  @Patch(':id')
  update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UserInfo() user: IUserFromToken,
    @Param('id') id: string
  ) {
    return this.categoryService.update({
      ...updateCategoryDto,
      id
    })
  }
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserInfo() user: IUserFromToken,
    @Query() queryParams: any
  ) {
    return this.categoryService.remove(id, queryParams, user)
  }

  @Get('advanced/qs')
  getAdvanced(@Query() query: any) {
    return this.categoryService.advanced(query)
  }
}
