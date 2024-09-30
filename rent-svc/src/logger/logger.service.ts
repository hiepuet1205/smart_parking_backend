import { Injectable, Scope } from '@nestjs/common';
import { logger } from './winston.config';
import { LoggerOptions as TypeOrmLoggerOptions } from 'typeorm/logger/LoggerOptions';
import { QueryRunner, Logger as TypeOrmLogger } from 'typeorm';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  log(message: string, context?: string, options?: any) {
    logger.info(message, { context, options });
  }

  error(message: string, trace: string, context?: string) {
    logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }
}

export class TypeOrmLoggerContainer implements TypeOrmLogger {
  static ForConnection(connectionName: string, options: TypeOrmLoggerOptions) {
    const logger = new LoggerService();
    logger.log(`TypeORM[${connectionName}]`, 'TypeOrm', '');

    return new TypeOrmLoggerContainer(logger, options);
  }

  constructor(
    private readonly _logger: LoggerService,
    private readonly _options: TypeOrmLoggerOptions,
  ) {}

  /**
   * Logs query and parameters used in it.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (this._options === 'all' || this._options === true || (this._options instanceof Array && this._options.indexOf('query') !== -1)) {
      const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
      this._logger.log('query' + ': ' + sql, 'QUERY');
    }
  }

  /**
   * Logs query that is failed.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (this._options === 'all' || this._options === true || (this._options instanceof Array && this._options.indexOf('error') !== -1)) {
      const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
      this._logger.error('query failed: ' + sql, 'QUERY ERROR');
      this._logger.error('error:', error);
    }
  }

  /**
   * Logs query that is slow.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
    this._logger.warn('query is slow: ' + sql, 'QUERY SLOW');
    this._logger.warn('execution time: ' + time);
  }

  /**
   * Logs events from the schema build process.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    if (this._options === 'all' || (this._options instanceof Array && this._options.indexOf('schema') !== -1)) {
      this._logger.log(message, 'SCHEMA BUILD');
    }
  }

  /**
   * Logs events from the migrations run process.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  logMigration(message: string, queryRunner?: QueryRunner) {
    this._logger.log(message, 'MIGRATION');
  }

  /**
   * Perform logging using given logger, or by default to the this._logger.
   * Log has its own level and message.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        if (this._options === 'all' || (this._options instanceof Array && this._options.indexOf('log') !== -1)) this._logger.log(message);
        break;
      case 'info':
        if (this._options === 'all' || (this._options instanceof Array && this._options.indexOf('info') !== -1))
          this._logger.debug(message);
        break;
      case 'warn':
        if (this._options === 'all' || (this._options instanceof Array && this._options.indexOf('warn') !== -1)) this._logger.warn(message);
        break;
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
