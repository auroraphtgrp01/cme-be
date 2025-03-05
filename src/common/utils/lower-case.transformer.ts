import { MaybeType } from '@/common/types/maybe-type'
import { TransformFnParams } from 'class-transformer/types/interfaces'

export const lowerCaseTransformer = (params: TransformFnParams): MaybeType<string> => params.value?.toLowerCase().trim()
