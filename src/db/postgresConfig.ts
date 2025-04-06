import config from '../config';
import { Client } from 'pg';

const { user, host, name: database, password, port } = config.get('database');

export const db = new Client({
  user,
  host,
  database,
  password,
  port,
});
