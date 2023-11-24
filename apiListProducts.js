const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());

const port = 3000;

require("dotenv").config();

// Define tu API Key
const apiKey = process.env.API_KEY || "4GgYsz5FDfnk"; // Puedes definir la API key en el archivo .env

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
  const listProductsQuery = `SELECT nameProduct, amount, notes, price FROM products`;

  pool
    .query(listProductsQuery)
    .then((data) => {
      console.log("List products: ", data.rows);
      res.status(200).send(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "server error your data could not be saved" });
    });
});

app.get("/products/:id", function (req, res) {
  const listUsersQuery = `SELECT id, nameProduct, amount, notes, price FROM products WHERE id = $1`;
  const productId = req.params.id;

  pool
    .query(listUsersQuery, [productId])
    .then((data) => {
      console.log("List products: ", data.rows);
      if (data.rows.length > 0) {
        res.status(200).send(data.rows[0]);
      } else {
        res.status(404).json({ error: "product not found try again" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "server error your data could not be saved" });
    });
});
app.post("/products", function (req, res) {
  const { nameProduct, amount, notes } = req.body;
  const insertar = `INSERT INTO products(id, nameProduct, amount, notes, price) VALUES($1, $2, $3, $4) RETURNING *`;
  const randomPrice = Math.round(Math.random() * 100, 1000);

  pool
    .query(insertar, [nameProduct, amount, notes, randomPrice])
    .then((data) => {
      console.log("Product saved: ", data.rows[0]);
      res.status(201).send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "server error your data could not be saved" });
    });
});

app.listen(port, function () {
  console.log(`the product database is running ${port}`);
});
