import { ValidationPipe, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { t } from '@shared/utils';
import { MetadataStorage, ValidationError, getMetadataStorage } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { IsInvalidKeys, ValidationCustoms } from '@shared/constants/validation-customs';

@Injectable()
export class FormattedValidationPipe extends ValidationPipe {
  constructor(resource: string) {
    super({
      exceptionFactory: (errors) => {
        throw new RpcException({
          code: grpc.status.INVALID_ARGUMENT,
          message: JSON.stringify(errors.flatMap((error) => formattedError(error, resource))),
        });
      },
    });
  }
}

export const formattedError = (error: ValidationError, resource: string) => {
  if (error.children && error.children.length) {
    return error.children.flatMap((childError) => formattedError(childError, resource));
  }

  const constraints = Object.keys(error.constraints).map((key) => {
    key = IsInvalidKeys.includes(key) ? 'isInvalid' : key;

    if (ValidationCustoms?.indexOf(key) === -1) {
      const metadataStorage: MetadataStorage = getMetadataStorage();
      const metas = metadataStorage.getTargetValidationMetadatas(error.target.constructor, null, false, false);
      const constraintMetas = metas.find((meta) => meta.propertyName === error.property && meta.name === key);
      if (I18nContext.current()) {
        return t(`validation.${key}`, {
          args: { property: error.property, value: error.value, constraint: constraintMetas?.constraints?.[0] },
        });
      }
    }
    return error.constraints[key];
  });

  const fieldI18n = I18nContext.current() ? t(`validation.entities.${error.target.constructor.name}.${error.property}`) : error.property;

  const formattedErrors = [...new Set(constraints)].map((constraint) => ({
    resource,
    field: fieldI18n,
    message: constraint.replace(error.property, fieldI18n),
  }));

  return formattedErrors;
};
