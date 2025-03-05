import { UserInfo } from '@/common/decorators/users.decorator';
import { ChangePasswordDto } from '@/core/auth/dto/create-auth.dto';
import { RegisterUserDto, UpdateUserDto, ValidateUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import { UserService } from '@/modules/users/users.service';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/validate')
  async validateUser(@Body() user: ValidateUserDto) {
    return this.userService.validateUser(user);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserInfo() user: IUserFromToken
  ) {
    return await this.userService.updatePassword(user.userId, changePasswordDto.oldPassword, changePasswordDto.newPassword)
  }

  @Post()
  create(
    @Body() registerUserDto: RegisterUserDto,
    @UserInfo() user: IUserFromToken
  ) {
    return this.userService.create(registerUserDto, user)
  }

  @Get('/token')
  getMe(@UserInfo() user: IUserFromToken) {
    return this.userService.getMe(user)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserInfo() user: IUserFromToken
  ) {
    return this.userService.updateUser(id, updateUserDto, user)
  }

  @Get('/advanced/qs')
  getAdvanced(@Query() queryString: string) {
    return this.userService.queryAdvanced(queryString)
  }

}
