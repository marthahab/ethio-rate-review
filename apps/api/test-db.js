const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5433,
  user: 'prisma_user',
  password: 'prisma_password',
  database: 'ethio_rate_review',
});

client.connect()
  .then(() => client.query('SELECT current_user, current_database()'))
  .then(result => {
    console.log(result.rows);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    client.end();
  });