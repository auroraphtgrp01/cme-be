export type OmitErrorCode<ObjectType extends object> = {
  [Key in keyof ObjectType]: Key extends 'errors'
    ? never
    : ObjectType[Key] extends object
      ? OmitErrorCode<ObjectType[Key]>
      : ObjectType[Key]
}

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof OmitErrorCode<ObjectType> & (string | number)]: OmitErrorCode<ObjectType>[Key] extends object
    ? `${Key}.${NestedKeyOf<OmitErrorCode<ObjectType>[Key]>}`
    : `${Key}`
}[keyof OmitErrorCode<ObjectType> & (string | number)]

export type NestedKeyOfSecond<ObjectType extends object> = {
  [Key in keyof OmitErrorCode<ObjectType> & (string | number)]: OmitErrorCode<ObjectType>[Key] extends object
    ? `${Key}.${keyof OmitErrorCode<ObjectType>[Key] & (string | number)}`
    : `${Key}`
}[keyof OmitErrorCode<ObjectType> & (string | number)]

export type OnlyErrors<ObjectType extends object> = {
  [Key in keyof ObjectType]: Key extends 'errors' ? ObjectType[Key] : never
}[keyof ObjectType]

export type NestedKeyOfErrors<ObjectType extends object> = keyof OnlyErrors<ObjectType> & (string | number)
