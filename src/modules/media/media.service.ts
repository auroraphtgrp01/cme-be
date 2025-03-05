import { DatabaseService } from '@/core/database/database.service';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ICreateMediaDto } from '@/modules/media/dto/media.dto';
import { EUploadFileType } from '@/modules/file/dto/uploadfile.dto';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class MediaService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(MediaService.name);
  async createMedia(createMediaDto: ICreateMediaDto) {
    const mediaId = createMediaDto.mediaId ?? null
    if (mediaId) {
      const media = await this.databaseService.client.media.findFirst({
        where: {
          id: mediaId
        }
      })
      if (!media) {
        throw new UnprocessableEntityException('Media not found')
      }
      return media
    }
    const x = await this.databaseService.client.media.create({
      data: {
        course: createMediaDto.courseId
          ? {
            connect: {
              id: createMediaDto.courseId
            }
          }
          : undefined,
        lesson: createMediaDto.lessonId
          ? {
            connect: {
              id: createMediaDto.lessonId
            }
          }
          : undefined,
        seminar: createMediaDto.seminarId
          ? {
            connect: {
              id: createMediaDto.seminarId
            }
          }
          : undefined,
        avatarUser: createMediaDto.avatarUserId
          ? {
            connect: {
              id: createMediaDto.avatarUserId
            }
          }
          : undefined,
        mediaType: createMediaDto.mimeTypes,
        mediaUrl: createMediaDto.path,
        types: createMediaDto.types
      },
      select: {
        id: true
      }
    })
    return x
  }

  streamFile(name: string, type: EUploadFileType) {
    const filePathFromName = name;
    const fPath = path.join(process.cwd(), filePathFromName);
    if (!fs.existsSync(fPath)) {
      throw new NotFoundException(`File not found`);
    }
    return fs.createReadStream(fPath);
  }
  streamVideo(name: string, req: Request) {
    const filePathFromName = name;
    const fPath = path.join(process.cwd(), filePathFromName);

    if (!fs.existsSync(fPath)) {
      throw new NotFoundException('File not found');
    }

    const videoSize = fs.statSync(fPath).size;
    const range = req.headers['range'];

    // Handle range request for better streaming
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

      // Limit chunk size to prevent memory issues
      const maxChunkSize = 2 * 10 ** 6; // 2MB chunks
      const chunkEnd = Math.min(start + maxChunkSize, end);
      const contentLength = chunkEnd - start + 1;

      const headers = {
        'Content-Range': `bytes ${start}-${chunkEnd}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      };

      const videoStream = fs.createReadStream(fPath, { start, end: chunkEnd });
      return { videoStream, headers, statusCode: 206 };
    } else {
      // Handle non-range requests (initial request)
      const maxInitialChunkSize = 2 * 10 ** 6; // 2MB for initial chunk
      const end = Math.min(maxInitialChunkSize, videoSize - 1);

      const headers = {
        'Content-Length': videoSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      };

      const videoStream = fs.createReadStream(fPath, { start: 0, end });
      return { videoStream, headers, statusCode: 200 };
    }
  }
}
