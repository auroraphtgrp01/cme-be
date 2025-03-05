import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserFromToken } from '@/modules/users/user.i';
import { ExceptionErrorsHandler } from '@/core/errors/handler.service';
import { UserService } from '@/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.accessTokenSecret', { infer: true }),
      ignoreExpiration: true,
    });
  }

  async validate(payload: IUserFromToken) {
    const { userId } = payload;
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new ExceptionErrorsHandler('NotFoundException', 'USER-001');
    }
    return {
      fullName: user.full_name,
      email: user.email,
      userId: user.id,
      status: user.status,
      roles: user.roles
    };
  }
}
