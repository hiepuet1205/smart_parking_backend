import { DataSource } from 'typeorm';
import 'dotenv/config';
import { configValue } from './database';

export default new DataSource(configValue);
