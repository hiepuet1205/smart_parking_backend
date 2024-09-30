import { ValidationPipe, Injectable, BadRequestException } from '@nestjs/common';
import { FieldErrorsResponseDto } from '@shared/dto/res/app.base.response';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(entity: string) {
    super({
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          errors: errors.map((error) => {
            return {
              resource: entity,
              field: error.property,
              message: Object.values(error.constraints).join(', '),
            };
          }),
        } as FieldErrorsResponseDto);
      },
    });
  }
}
