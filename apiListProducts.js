const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const port = 3000;

require('dotenv').config();

// Define tu API Key
const apiKey = "4GgYsz5FDfnk";

// Crea una función de middleware para verificar la API key
function verifyApiKey(req, res, next) {
  const providedApiKey = req.headers["api-key"];

  if (providedApiKey && providedApiKey === apiKey) {
    // La API key es válida
    next();
  } else {
    // La API key no es válida
    res.status(403).json({ error: "Acceso no autorizado. API key inválida." });
  }
}

// Agrega el middleware de verificación de API key a las rutas que deseas proteger
app.use("/products", verifyApiKey);

const pool = new Pool({
  user: "default",
  host: "ep-summer-hill-45014262-pooler.us-east-1.postgres.vercel-storage.com",
  database: "verceldb",
  password: "4GgYsz5FDfnk",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.get("/products", function (req, res) {
  const listProductsQuery = `SELECT * FROM products`;

  pool
    .query(listProductsQuery)
    .then((data) => {
      console.log("List products: ", data.rows);
      res.status(201).send(data.rows);
      // No uses pool.end() aquí, ya que cerraría la conexión para siempre
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/products/:id", function (req, res) {
  const listUsersQuery = `SELECT * FROM products WHERE id = ${req.params.id}`;

  pool
    .query(listUsersQuery)
    .then((data) => {
      console.log("List products: ", data.rows);
      res.status(201).send(data.rows);
      // No uses pool.end() aquí, ya que cerraría la conexión para siempre
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/products", function (req, res) {
  const id = req.body.id;
  const nameProduct = req.body.nameProduct;
  const amount = req.body.amount;
  const notes = req.body.notes;
  const insertar = `INSERT INTO products(id, nameProduct, amount, notes) VALUES(${id}, '${nameProduct}', '${amount}', '${notes}')`;

  pool
    .query(insertar)
    .then(() => {
      res.status(201).send("products save");
    })
    .catch((err) => {
      console.error(err);
    });
  console.log(req.body);
});

app.listen(port, function () {
  console.log(`the products database is initializing`);
});
