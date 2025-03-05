import { SetMetadata } from '@nestjs/common'

export const SkipTransformInterceptor = () => SetMetadata('skipTransform', true)
