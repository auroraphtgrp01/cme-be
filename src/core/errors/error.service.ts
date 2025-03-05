import { Injectable } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { ConfigService } from '@nestjs/config'
import * as _ from 'lodash'
import { II18nErrorException } from '@/common/types/exception-error.type'
import { I18nTranslationKeysOfError } from '@/common/types/translate.t'

@Injectable()
export class ErrorService {
  constructor(private readonly configService: ConfigService) {}
  messagesWithErrorCode(errorCode: string, i18n: any, errorName: string): II18nErrorException {
    console.error(errorCode)
    return i18n
      ? i18n.t(`errors.${errorCode}`)
      : {
          errorCode: errorCode,
          message: errorName,
          detail: []
        }
  }

  message(err: string | object, i18n: any, stackTrace: any): string {
    const errorMessage = _.isArray(err['message']) ? err['message'][0] : err['message']
    console.error(err)
    switch (err['error']) {
      case 'Bad Request':
        return this.combine(errorMessage, i18n)
      case 'Forbidden':
        return this.combine(errorMessage, i18n)
      case 'Internal Server Error':
        return this.combineDev(errorMessage, i18n, stackTrace)
      case 'Not Found':
        return this.combine(errorMessage, i18n)
      case 'Unauthorized':
        return this.combine(errorMessage, i18n)
      case 'Unprocessable Entity':
        return this.handleUnprocessEntity(err, i18n)
      default:
        return this.combine(errorMessage, i18n)
    }
  }

  private handleUnprocessEntity(error: string | object, i18n: any): string {
    const transformedError = this.transform(error['message'], i18n).flat()
    return this.combine('CUS-0401', i18n, transformedError)
  }

  private transform(
    errors: ValidationError[],
    i18n: any
  ): (string & {
    field: string
  })[][] {
    const transformedError = errors.map((err: ValidationError) => {
      return Object.values(err.constraints).map((value: string) => {
        return Object.assign(
          i18n.t(`errors.${value}`, {
            args: { property: err.property }
          }),
          { field: err.property }
        )
      })
    })

    return transformedError
  }

  private combine(err_msg: string, i18n: any, errors: object[] = []): string {
    if (!i18n) {
      return Object.assign(err_msg, { timestamp: new Date().toISOString(), errors })
    }
    const i18Message = i18n.t(`errors.${err_msg}`, {
      defaultValue: {
        messages: err_msg
      } as any
    }) as any
    return {
      timestamp: new Date().toISOString(),
      ...i18Message
    }
  }

  private combineDev(
    err_msg: string,
    i18n: any,
    stackTrace: any
  ): string & {
    details: any
  } {
    return Object.assign(i18n.t(`errors.${err_msg}`), {
      details: stackTrace
    })
  }
}
