import {
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
  IsEnum,
  IsBoolean,
  IsBooleanString
} from 'class-validator'

export enum ECategoryType {
  COURSE = 'COURSE',
  SEMINAR = 'SEMINAR'
}

export class CreateCategoryDto {
  @IsString()
  name: string

  @IsUUID()
  @IsOptional()
  courseId?: string

  @IsEnum(ECategoryType)
  type: ECategoryType

  @IsOptional()
  description?: string

  @IsUUID()
  @IsOptional()
  parentId?: string
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsUUID()
  @IsOptional()
  courseId?: string

  @IsOptional()
  description?: string

  @IsOptional()
  id?: string

  @IsBoolean()
  @IsOptional()
  status?: boolean
}

export class GetCategoryByType {
  @IsEnum(ECategoryType)
  @IsOptional()
  type: ECategoryType

  @IsBooleanString()
  @IsOptional()
  isIncludeCourseAndSeminar: boolean
}
