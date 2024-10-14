import { BadRequestException, Injectable, PayloadTooLargeException, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { t } from '@shared/utils';
import { FieldErrorsResponseDto } from '@shared/dto/res/app.base.response';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly type: string[],
    private readonly maxFileSizeMb?: number,
  ) {}

  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file) {
      throw new BadRequestException({
        errors: [
          {
            resource: 'File Upload',
            field: 'File',
            message: t('validation.isNotEmpty', { args: { property: 'File' } }),
          },
        ],
      } as FieldErrorsResponseDto);
    }

    if (this.maxFileSizeMb) {
      const maxFileSizeByte = this.maxFileSizeMb * 1024 * 1024;
      const maxFileSizeKb = this.maxFileSizeMb * 1024;

      if (file.size > maxFileSizeByte) {
        throw new PayloadTooLargeException({
          errors: [
            {
              resource: 'File Upload',
              field: 'File',
              message: t('validation.response_message.file_too_large', { args: { maxFileSizeKb } }),
            },
          ],
        } as FieldErrorsResponseDto);
      }
    }

    const fileInfo = await fromBuffer(file.buffer);

    if (!this.type.includes(fileInfo.mime)) {
      throw new UnsupportedMediaTypeException({ errors: [] } as FieldErrorsResponseDto);
    }

    return file;
  }
}
