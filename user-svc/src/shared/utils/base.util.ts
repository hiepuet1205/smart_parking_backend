import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { I18nContext, TranslateOptions } from 'nestjs-i18n';
import { LoggerService } from '@logger/logger.service';

const logger: LoggerService = new LoggerService();
export const t = (key: string, options?: TranslateOptions): string => {
  if (typeof I18nContext.current().t(key, options) === 'object') {
    return I18nContext.current().t(key.concat('.key'), options) || key;
  } else {
    return I18nContext.current().t(key, options) || key;
  }
};

export const renderResponse = (message: string, data = {}) => {
  return { message, data };
};

export const responseWithError = (message: string, exception: HttpException | any, data = {}) => {
  if (exception instanceof HttpException) {
    return {
      statusCode: exception?.getStatus() || 500,
      message: exception?.message || message || t('common.response_message.internal_error'),
      // errors: exception.getResponse(), // Implement later
      data,
    };
  }

  return {
    statusCode: 500,
    message: t('common.response_message.internal_error'),
    data,
  };
};

export const getGrpcData = async (promiseCall: Promise<any>, expectErrorResponse?: any) => {
  try {
    return await promiseCall;
  } catch (error) {
    logger.error(error.message, error.stack, 'GRPC_DATA');
    return expectErrorResponse || null;
  }
};

export const convertRawDataOne = (rawDataOne: object, entity_name: string) => {
  const convertedObject = {};
  Object.keys(rawDataOne).forEach((property) => (convertedObject[property.split(`${entity_name}_`, 2)[1]] = rawDataOne[property]));

  return convertedObject;
};

export const convertRawDataMany = (rawDataMany: object[], entity_name: string) => {
  return rawDataMany.map((rawDataOne) => convertRawDataOne(rawDataOne, entity_name));
};

export const withHandleError = async (successMessage: string, callback: CallableFunction) => {
  try {
    callback();
    return renderResponse(successMessage);
  } catch (error) {
    logger.error(error.message, error.trace, callback.name);
    throw new BadRequestException(renderResponse(error.message));
  }
};

export const sortObjectsByDate = (objects: Record<string, any>[], attribute: string, order: 'asc' | 'desc') => {
  return objects.sort((a, b) => {
    // Xử lý các giá trị null hoặc undefined
    if (!a[attribute] && !b[attribute]) return 0;
    if (!a[attribute]) return 1;
    if (!b[attribute]) return -1;

    // So sánh ngày
    if (order === 'asc') {
      return a[attribute] - b[attribute];
    } else {
      return b[attribute] - a[attribute];
    }
  });
};
