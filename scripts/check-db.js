require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.log('No POSTGRES_URL environment variable found in .env.local');
  process.exit(0);
}

const client = new Client({ connectionString });

async function checkDb() {
  try {
    await client.connect();
    const res = await client.query('SELECT current_database(), current_user');
    console.log('Connected to Vercel Postgres successfully:', res.rows[0]);
    const productsRes = await client.query('SELECT COUNT(*)::int FROM products');
    console.log('Product count:', productsRes.rows[0].count);
  } catch (err) {
    console.error('Postgres connection error:', err.message);
  } finally {
    await client.end();
  }
}

checkDb();
