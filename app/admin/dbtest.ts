import { Client } from 'pg';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'ap-southeast-2' });

async function main(): Promise<void> {
  let password: string = 'abc62271312';
  

  const client = new Client({
    host: '127.0.0.1',
    port: 5433,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log(res.rows[0].version);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}
main().catch(console.error);