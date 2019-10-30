import * as knex from 'knex';
import * as objection from 'objection';
import { IS_TEST } from 'settings';

export type Connection = ReturnType<typeof knex>;

const config = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_DB || 'waproject',
    user: process.env.DATABASE_USER || 'docker',
    password: process.env.DATABASE_PASSWORD || '123mudar',
    port: Number(process.env.DATABASE_PORT) || 3002
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/../migrations'
  },
  seeds: {
    directory: __dirname + '/../migrations/seeds'
  },
  debug: false
};

const configTest = {
  ...config,
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/../../bin/migrations'
  },
  seeds: {
    directory: __dirname + '/../../bin/migrations/seeds'
  },
  log: {
    warn() { },
    error(message: string) { console.error(message); },
    deprecate() { },
    debug() { },
  }
};

export async function connectAndMigrate(): Promise<Connection> {
  const connection = knex(IS_TEST ? configTest : config);
  objection.Model.knex(connection);

  await connection.migrate.latest();
  await connection.seed.run();

  return connection;
}