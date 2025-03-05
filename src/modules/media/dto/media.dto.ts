export interface ICreateMediaDto {
  path: string
  courseId?: string
  lessonId?: string
  avatarUserId?: string
  seminarId?: string
  mimeTypes: EUploadFileType
  types?: string
  mediaId?: string
}

export enum EUploadFileType {
  IMAGE = 'IMAGES',
  VIDEO = 'VIDEOS',
  AUDIO = 'AUDIOS',
  DOCUMENT = 'DOCUMENTS',
  SUBTITLE = 'SUBTITLES',
  MARKDOWN = 'MARKDOWNS'
}
