import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadFileDto } from '@/modules/file/dto/uploadfile.dto';
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 500 * 1024 * 1024 }
  }))
  async uploadFile(@Body() uploadFileDto: UploadFileDto, @UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(uploadFileDto, file);
  }
}
