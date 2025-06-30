import { Module } from '@nestjs/common';
import { CloudinaryService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [UploadFileController],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class UploadFileModule {}
