import * as dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

PG_USER = process.env.DB_USERNAME
PG_PASSWORD = process.env.DB_PASSWORD
PG_PORT = process.env.DB_PORT
PG_DB_NAME = process.env.DB_NAME

const pgp = pgPromise();
const db = pgp(`postgres://${PG_USER}:${PG_PASSWORD}@host:${PG_PORT}/${PG_DB_NAME}`);

export default db;
