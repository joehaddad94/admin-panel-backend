import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { enivroment } from '../server/enviroment';

dotenv.config({ path: enivroment });

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  ssl:
    process.env.DB_SSL_PROFILE === 'require'
      ? { rejectUnauthorized: false }
      : undefined,
  entities: ['dist/core/data/database/**/*.entity{.ts,.js}'],
  migrations: ['dist/core/config/db/migrations/*{.ts,.js}'],
  extra: {
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
    acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000'),
    timeout: parseInt(process.env.DB_TIMEOUT || '60000'),
  },
  synchronize: false, // Keep false for production
  logging: false, // Disable query logging
  // maxQueryExecutionTime: 1000, // Log queries taking more than 1 second
};

export default new DataSource(dataSourceOptions);
