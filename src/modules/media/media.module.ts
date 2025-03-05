import { MediaController } from '@/modules/media/media.controller';
import { MediaService } from '@/modules/media/media.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule { }
