import { CustomDecorator, SetMetadata } from '@nestjs/common'

export const IS_BYPASS_USER_STATUS = 'isBypassUserStatus'
export const ByPassUserStatus = (): CustomDecorator<string> => SetMetadata(IS_BYPASS_USER_STATUS, true)
