import { Injectable, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';
import { fromBuffer } from 'file-type';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly type: string[]) {}

  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file) {
      return null;
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
