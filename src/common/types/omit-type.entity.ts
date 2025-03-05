export type OmitResponseType<T> = Omit<
  T,
  'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy' | 'password'
>
