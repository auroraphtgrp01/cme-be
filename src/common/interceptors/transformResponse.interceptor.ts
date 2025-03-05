import { filterObject } from '@/common/utils/filterObject'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, map } from 'rxjs'

export interface Response {
  statusCode: number
  message: string
  data: any
}

const keysToRemove = ['createdAt', 'updatedAt', 'deletedAt', 'updatedBy', 'createdBy', 'password', 'deletedBy']

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    const request = context.switchToHttp().getRequest()
    const skipTransform = this.reflector.get<boolean>('skipTransform', context.getHandler())

    if (skipTransform) {
      return next.handle()
    }

    return next.handle().pipe(
      map((data) => ({
        message: data?.message,
        pagination: data?.pagination,
        data: filterObject(data?.data || data, keysToRemove),
        statusCode: context.switchToHttp().getResponse().statusCode
      }))
    )
  }
}
