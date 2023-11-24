const { Pool } = require('pg');

const pool = new Pool({
    user: 'default',
    host: 'ep-summer-hill-45014262-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: '4GgYsz5FDfnk',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});


const listProductsQuery = `SELECT * FROM products;`;

pool.query(listProductsQuery)
    .then(res => {
        console.log("List products: ", res.rows);
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });