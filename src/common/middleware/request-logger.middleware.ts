import { Logger } from '@nestjs/common'
import { NextFunction } from 'express'

export const RequestLoggerMiddleWare = (req: Request, res: Response, next: NextFunction): void => {
  const logger = new Logger('RequestLogger')
  const { method, url } = req
  // logger.verbose(`Request: ${method} ${url}}`)
  next()
}
