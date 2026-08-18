const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    user: 'postgres',
    password: '@Zuhaib467',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE destination_medusa');
    console.log('Database destination_medusa created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database destination_medusa already exists');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDb();
