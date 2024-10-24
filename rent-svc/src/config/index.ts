import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { dbConfig } from './database';

interface iConfig {
  env: string;
  port: number;
  database: PostgresConnectionOptions;
  userGrpcUrl: string;
  locationGrpcUrl: string;
  keys: {
    secretKey: string;
    vnpTmnCode: string;
    vnpHashkey: string;
  };
}

export default (): Partial<iConfig> => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3002,
  userGrpcUrl: process.env.USER_GRPC_URL,
  locationGrpcUrl: process.env.LOCATION_GRPC_URL,
  keys: {
    secretKey: process.env.SECRET_KEY,
    vnpTmnCode: process.env.VNP_TMNCODE,
    vnpHashkey: process.env.VNP_HASHKEY,
  },
  database: dbConfig(),
});
