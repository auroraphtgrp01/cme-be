import { AuthService } from '@/core/auth/auth.service';
import { LocalAuthGuard } from '@/core/auth/guards/local-auth.guard';
import { UserInfo } from '@/common/decorators/users.decorator';
import { RegisterUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  Headers,
  Patch,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public, SkipPermission } from '@/common/decorators/isPublicRoute';
import { Response } from 'express';
import { IJwtToken } from '@/common/types/token.i';
import { ByPassUserStatus } from '@/common/decorators/bypassUserStatus';
import { ChangePasswordDto, RegisterUserNormal } from '@/core/auth/dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  @Public()
  @ApiOperation({
    tags: ['auth'],
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
  })
  @UseGuards(LocalAuthGuard)
  async login(
    @UserInfo() user: IUserFromToken,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.login(user);
    // res.cookie('token', data.accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   path: '/',
    //   domain:
    //     process.env.NODE_ENV === 'production' ? 'api.uniko.id.vn' : 'localhost',
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    return data;
  }

  @Get('/check-token')
  @SkipPermission()
  async checkAuth() {
    return true;
  }

  @Public()
  @Post('register')
  register(@Body() registerUserNormalDto: RegisterUserNormal) {
    return this.authService.registerUserNormal(registerUserNormalDto)
  }


}
