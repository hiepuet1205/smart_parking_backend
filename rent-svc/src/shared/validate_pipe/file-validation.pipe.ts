import { UnsupportedMediaTypeException } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { t } from '@shared/utils';
import { FieldErrorsResponseDto } from '@shared/dto/res/app.base.response';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly type: string[]) {}

  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file) {
      throw new BadRequestException({
        errors: [
          {
            resource: 'File Upload',
            field: 'File',
            message: t('common.response_message.file_required'),
          },
        ],
      } as FieldErrorsResponseDto);
    }

    const fileInfo = await fromBuffer(file.buffer);

    if (!this.type.includes(fileInfo.mime)) {
      throw new UnsupportedMediaTypeException({
        status: 'fail',
        message: 'File type not supported',
        data: {},
      });
    }

    return file;
  }
}
