import { ExceptionErrorsHandler } from '@/core/errors/handler.service'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export async function fireValidateDto(dto: any, data: any): Promise<void> {
  const errors = await validate(plainToInstance(dto, data))
  if (errors.length > 0) throw new ExceptionErrorsHandler('BadRequestException', 'PRISMA-100')
}
