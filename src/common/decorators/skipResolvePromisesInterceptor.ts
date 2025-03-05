import { SetMetadata } from '@nestjs/common'

export const SkipResolvePromisesInterceptor = () => SetMetadata('skipResolvePromises', true)
