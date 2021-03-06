import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DATABASE_URL,
  NODE_ENV,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  url: DATABASE_URL,
  migrations: ['src/db/migrations/*.ts'],
  // to be able to connect to Heroku DB
  extra: {
    ssl: NODE_ENV === 'production',
  },
  logging: NODE_ENV !== 'production',
});
