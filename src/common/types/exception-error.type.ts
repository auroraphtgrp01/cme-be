import { Response } from 'express'

export interface IExecutionContextOfExceptionParams {
  res: Response
  status?: number
  errors?: any
  i18n: any
  stackTrace?: string
}

export interface II18nErrorException {
  errorCode: string
  message: string
  detail: string[]
}
