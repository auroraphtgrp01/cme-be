import { isModelOfPrisma } from '@/common/utils/getModelPrisma'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsPrismaModelConstraint implements ValidatorConstraintInterface {
  validate(modelNames: string[], args: ValidationArguments) {
    const { isValid } = isModelOfPrisma(modelNames)
    return isValid
  }

  defaultMessage(args: ValidationArguments) {
    const { invalidModels } = isModelOfPrisma(args.value)
    if (invalidModels.length > 0) {
      return `INVALID-100`
    }
    return `All model names are valid.`
  }
}

export function IsPrismaModel(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPrismaModelConstraint
    })
  }
}
