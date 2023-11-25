const { Pool } = require('pg');

const pool = new Pool({
    user: 'default',
    host: "ep-misty-dawn-63641137-pooler.us-east-1.postgres.vercel-storage.com",
    database: 'verceldb',
    password: "lY4UHB8OZotw",
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

const createProductsTableQuery = `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    nameProduct VARCHAR(50),
    amount VARCHAR(50),
    notes TEXT,
    price FLOAT -- Cambiado de "float" a "FLOAT"
);`;

pool.query(createProductsTableQuery)
    .then(res => {
        console.log("Tabla creada");
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });

