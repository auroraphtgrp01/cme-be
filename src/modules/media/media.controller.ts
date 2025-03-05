import { EUploadFileType } from '@/modules/file/dto/uploadfile.dto';
import { MediaService } from '@/modules/media/media.service';
import { Controller, Get, Param, Res, Query, NotFoundException, Req } from '@nestjs/common';
import { Response } from 'express';
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Get('stream/:type')
  async streamByType(
    @Param('type') type: EUploadFileType,
    @Query('path') path: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (type === EUploadFileType.VIDEO) {
        const { videoStream, headers, statusCode } = this.mediaService.streamVideo(path, req);
        res.writeHead(statusCode, headers);
        videoStream.on('error', (error) => {
          console.error('Video streaming error:', error);
          res.status(500).end();
        });

        return videoStream.pipe(res);
      } else {
        const fileStream = this.mediaService.streamFile(path, type);
        return fileStream.pipe(res);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: 'File not found' });
      } else {
        console.error('Streaming error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

}
