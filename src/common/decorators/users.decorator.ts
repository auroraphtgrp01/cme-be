import { ExecutionContext, createParamDecorator } from '@nestjs/common'
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user as any
  return data ? user?.[data] : user
})
