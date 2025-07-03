import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './upload-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { I18n, I18nService } from 'nestjs-i18n';

@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

   @Get("test")
   test(@I18n() i18n: I18nService){
    return i18n.t("translation.HELLO")
   }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }
}
