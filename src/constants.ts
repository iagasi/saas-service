import * as dotenv from 'dotenv';
dotenv.config({});

export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const DB_NAME = process.env.PG_DATABASE;
export const DB_HOST = process.env.PG_HOST;
export const DB_PORT = process.env.PG_PORT;
export const DB_PASSWORD = process.env.PG_PASSWORD;
export const SECRET_JWT = process.env.SECRET_JWT;
export const SALT = process.env.SALT;
