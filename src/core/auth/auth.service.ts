import { IJwtToken } from '@/common/types/token.i';
import { comparePassword } from '@/common/utils/hashPassword';
import { ChangePasswordDto, RegisterUserNormal } from '@/core/auth/dto/create-auth.dto';
import { ExceptionErrorsHandler } from '@/core/errors/handler.service';
import { IUserFromToken } from '@/modules/users/user.i';
import { UserService } from '@/modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) { }

  async login(user: IUserFromToken) {
    const userValid = await this.userService.getById(user.userId);
    if (!userValid)
      throw new ExceptionErrorsHandler('NotFoundException', 'USER-001');
    if (userValid.status === UserStatus.BLOCK)
      throw new ExceptionErrorsHandler('BadRequestException', 'AUTH-123');
    const payload = {
      userId: userValid.id,
      email: userValid.email,
      fullName: userValid.full_name,
      status: userValid.status,
      roles: userValid.roles
    };
    const token = await this.generateAccessTokenAndRefreshToken(payload);
    return {
      ...token,
      user,
    };
  }

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('auth.accessTokenSecret'),
      expiresIn: this.configService.get('auth.accessTokenExpiresIn'),
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('auth.refreshTokenSecret'),
      expiresIn: this.configService.get('auth.refreshTokenExpiresIn'),
    });
  }

  async generateAccessTokenAndRefreshToken(payload: any): Promise<IJwtToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async registerUserNormal(registerUserNormalDto: RegisterUserNormal) {
    const user = await this.userService.registerUserNormal(
      registerUserNormalDto
    );
    // this.kafkaService.getInstances('mediaService').emit('sendEmail', {
    //   emailReceiver: user?.data?.email,
    //   nameOfReceiver: user?.data?.full_name,
    //   types: 'verify-email',
    //   registration_date: new Date(),
    //   verification_url: `https://hoclientuc.vn/verify-email?token=${token}`,
    // });
    return user;
  }

  async validateToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.configService.get<string>('auth.accessTokenSecret', {
        infer: true,
      }),
    });
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async changePassword(payload: ChangePasswordDto, user: IUserFromToken) {
    return await this.userService.updatePassword(user.userId, payload.oldPassword, payload.newPassword)
  }
}
