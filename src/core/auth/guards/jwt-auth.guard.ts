import { IS_BYPASS_USER_STATUS } from '@/common/decorators/bypassUserStatus';
import { IS_PUBLIC_KEY } from '@/common/decorators/isPublicRoute';
import { ExceptionErrorsHandler } from '@/core/errors/handler.service';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isBypassUserStatus = this.reflector.getAllAndOverride<boolean>(
      IS_BYPASS_USER_STATUS,
      [context.getHandler(), context.getClass()]
    );

    if (isPublic) {
      return true;
    }

    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    return true;
  }

  handleRequest(err: Error, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw (
        err || new ExceptionErrorsHandler('UnauthorizedException', 'AUTH-112')
      );
    }
    return user;
  }
}
