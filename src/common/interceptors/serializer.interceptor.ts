import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import deepResolvePromises from '@/common/utils/deep-resolver'

@Injectable()
export class ResolvePromisesInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipResolvePromises = this.reflector.get<boolean>('skipResolvePromises', context.getHandler())
    if (skipResolvePromises) {
      return next.handle()
    }

    return next.handle().pipe(map(deepResolvePromises))
  }
}
