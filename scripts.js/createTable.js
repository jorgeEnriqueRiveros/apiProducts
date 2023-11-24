const { Pool } = require('pg');

const pool = new Pool({
    user: 'default',
    host: "ep-summer-hill-45014262-pooler.us-east-1.postgres.vercel-storage.com",
    database: 'verceldb',
    password: "4GgYsz5FDfnk",
    port: 5432,
    ssl: {rejectUnauthorized: false},
});

const createProductsTableQuery = `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    nameProduct VARCHAR(50),
    amount VARCHAR(50),
    notes TEXT
    );`;
const addPriceColumnQuery = `ALTER TABLE products
    ADD COLUMN price NUMERIC;`;

pool.query(addPriceColumnQuery)
    .then(res => {
        console.log("Campo 'price' agregado a la tabla 'products'");
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });

pool.query(createProductsTableQuery)
    .then(res => {
        console.log("Tabla creada");
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });
