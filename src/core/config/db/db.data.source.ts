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
};

export default new DataSource(dataSourceOptions);
