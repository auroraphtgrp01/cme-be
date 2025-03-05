import { BadRequestException, Body, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EUploadFileType, UploadFileDto, ETypesPathUploadFile } from '@/modules/file/dto/uploadfile.dto';
import { QueueRedisService } from '@/core/queues/queue-redis.service';
import * as fs from 'fs';
import * as path from 'path';
import { getFileExtension } from '@/modules/file/utils/getFileExtension';
import { enumValuesToObject } from '@/common/utils/flatEnumToObjects';
import { ConfigService } from '@nestjs/config';
import { MediaService } from '@/modules/media/media.service';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mediaService: MediaService
  ) { }

  private tempPath = 'resources/temps'

  async uploadFile(uploadFileDto: UploadFileDto, file: Express.Multer.File) {
    if (!uploadFileDto?.mimeTypes || !(uploadFileDto?.lessonId || uploadFileDto?.courseId || uploadFileDto?.seminarId || uploadFileDto?.userId)) {
      throw new UnprocessableEntityException('types and either lessonId or courseId or seminarId or userId are required');
    }
    if (!file) {
      throw new UnprocessableEntityException('file is required');
    }
    if (!enumValuesToObject(EUploadFileType).includes(uploadFileDto.mimeTypes)) {
      throw new UnprocessableEntityException('types must be one of EUploadFileType ( IMAGES, VIDEOS, AUDIOS, DOCUMENTS, SUBTITLES, MARKDOWNS )');
    }
    if (uploadFileDto.types && !enumValuesToObject(ETypesPathUploadFile).includes(uploadFileDto.types)) {
      throw new UnprocessableEntityException('types must be one of ETypesPathUploadFile ( AVATAR ,THUMBNAIL,CCCD_1,CCCD_2,CARD_PHOTO )');
    }
    const fileName = await this.moveFileToDestination((uploadFileDto?.lessonId ? uploadFileDto.lessonId : (uploadFileDto?.courseId ? uploadFileDto.courseId : (uploadFileDto.seminarId ? uploadFileDto.seminarId : uploadFileDto.userId))), file.filename, uploadFileDto.mimeTypes, uploadFileDto.types)
    const media = await this.mediaService.createMedia({
      path: fileName,
      mimeTypes: uploadFileDto.mimeTypes,
      types: uploadFileDto.types,
      courseId: uploadFileDto?.courseId,
      lessonId: uploadFileDto?.lessonId,
      seminarId: uploadFileDto?.seminarId,
      avatarUserId: uploadFileDto?.userId,
      mediaId: uploadFileDto?.mediaId
    })
    return {
      status: 'SUCCESS',
      message: 'File uploaded successfully',
      media
    }
  }

  async moveFileToDestination(fileName: string, originalFile: string, mimeType: EUploadFileType, typePath?: string) {
    try {
      const oldPath = path.resolve(this.tempPath, originalFile);
      const destDir = this.filePathByType(mimeType, fileName, typePath);
      const fileExtension = getFileExtension(originalFile);
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true });
      }
      fs.mkdirSync(destDir, { recursive: true });
      const newPath = path.resolve(destDir, `${fileName}${fileExtension}`);
      fs.copyFileSync(oldPath, newPath);
      fs.unlinkSync(oldPath);

      return `${destDir}/${fileName}${fileExtension}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }





  private filePathByType = (types: EUploadFileType, id: string, typePath?: string) => {
    const basePath = `resources/${id}`;
    switch (types) {
      case EUploadFileType.IMAGE:
        return typePath ? `${basePath}/images/${typePath}` : `${basePath}/images`;
      case EUploadFileType.VIDEO:
        return typePath ? `${basePath}/videos/${typePath}` : `${basePath}/videos`;
      case EUploadFileType.AUDIO:
        return typePath ? `${basePath}/audios/${typePath}` : `${basePath}/audios`;
      case EUploadFileType.DOCUMENT:
        return typePath ? `${basePath}/documents/${typePath}` : `${basePath}/documents`;
      case EUploadFileType.SUBTITLE:
        return typePath ? `${basePath}/subtitles/${typePath}` : `${basePath}/subtitles`;
      case EUploadFileType.MARKDOWN:
        return typePath ? `${basePath}/markdowns/${typePath}` : `${basePath}/markdowns`;
      default:
        throw new BadRequestException(`Unsupported file type: ${types}`);
    }
  }
}
