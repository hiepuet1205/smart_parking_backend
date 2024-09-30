import { Logger } from '@nestjs/common';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import 'dotenv/config';

import { TypeOrmLoggerContainer } from '@logger/logger.service';

export const configValue: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: process.env.POSTGRES_SSL === 'true',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false,
  dropSchema: false,
  logging: true,
  logger: TypeOrmLoggerContainer.ForConnection('SMART_PARKING_CONNECTION', 'all'),
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
};

export const dbConfig = (): PostgresConnectionOptions => configValue;

if (process.env.NODE_ENV === 'development') {
  Logger.debug(dbConfig());
}

export default dbConfig();
