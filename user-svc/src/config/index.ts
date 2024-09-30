import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { dbConfig } from './database';

interface iConfig {
  env: string;
  port: number;
  database: PostgresConnectionOptions;
  keys: {
    secretKey: string;
  };
}

export default (): Partial<iConfig> => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3002,
  keys: {
    secretKey: process.env.SECRET_KEY,
  },
  database: dbConfig(),
});
