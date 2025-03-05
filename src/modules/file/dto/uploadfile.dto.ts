export enum EUploadFileType {
    IMAGE = 'IMAGES',
    VIDEO = 'VIDEOS',
    AUDIO = 'AUDIOS',
    DOCUMENT = 'DOCUMENTS',
    SUBTITLE = 'SUBTITLES',
    MARKDOWN = 'MARKDOWNS'
}

export enum ETypesPathUploadFile {
    AVATAR = 'avatar',
    CCCD_1   = 'cccd_1',
    CCCD_2 = 'cccd_2',
    CARD_PHOTO = 'card_photo'
}

export class UploadFileDto {
    mimeTypes: EUploadFileType
    types?: ETypesPathUploadFile
    file: Express.Multer.File
    mediaId: string
    courseId: string
    lessonId: string
    seminarId: string
    userId: string
}