import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({});

const DB_NAME: string = process.env.PG_DATABASE || 'db-name';
const DB_USER: string = process.env.PG_USER || 'postgres';
const DB_HOST: string = process.env.PG_HOST || 'localhost';
const DB_PASSWORD: string = process.env.PG_PASSWORD || 'root';
export async function setupDatabase() {
  const client = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: 5432,
  });

  await client.connect();

  const res = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`,
  );

  if (res.rowCount === 0) {
    console.log(`${DB_NAME} database not found, creating it.`);
    await client.query(`CREATE DATABASE "${DB_NAME}";`);
    console.log(`created database ${DB_NAME}.`);
  } else {
    console.log(`${DB_NAME} database already exists.`);
  }

  await client.end();
}
