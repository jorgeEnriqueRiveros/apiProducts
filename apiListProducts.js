const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const port = 3000;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "database products",
      version: "1.0.0",
    },
  },
  apis: ["apiListProducts.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Hola, mundo!");
});

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
  host: "ep-misty-dawn-63641137-pooler.us-east-1.postgres.vercel-storage.com",
  database: "verceldb",
  password: "lY4UHB8OZotw",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.get("/products", function (req, res) {
  const listProductsQuery = `SELECT id, nameProduct, amount, notes, price FROM products`;

  pool
    .query(listProductsQuery)
    .then((data) => {
      console.log("List products: ", data.rows);
      res.status(200).send(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "server error your data could not be saved" });
    });
});
app.post("/products", function (req, res) {
  const { nameProduct, amount, notes, price } = req.body;

  if (!nameProduct || !amount || !price) {
      return res.status(400).json({ error: "nameProduct, amount, and price are required fields" });
  }

  const insertProductQuery = `
      INSERT INTO products (nameProduct, amount, notes, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;

  const values = [nameProduct, amount, notes, price];

  pool
      .query(insertProductQuery, values)
      .then((data) => {
          console.log("Product added: ", data.rows[0]);
          res.status(201).json(data.rows[0]);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "server error, product could not be added" });
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
      res
        .status(500)
        .json({ error: "server error your data could not be saved" });
    });
});
app.put("/products/:id", function (req, res) {
  const id = req.params.id;
  const updatePrice = `UPDATE products SET price = $1 WHERE id = $2 RETURNING *`;
  const newRandomPrice = Math.round(Math.random() * 10000, 10);

  pool
    .query(updatePrice, [newRandomPrice, id])
    .then((data) => {
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      console.log("Product price updated: ", data.rows[0]);
      res.status(200).send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "Server error, could not update product price" });
    });
});
app.delete("/products/:id", function (req, res) {
  const eliminar = `DELETE FROM products WHERE id=${req.params.id}`;
  console.log(eliminar);
  pool
    .query(eliminar)
    .then(() => {
      res.status(204).send("Products Deleted");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  console.log(req.body);
});

app.put("/products/:id", function (req, res) {
  const { nameProduct, amount, notes } = req.body;
  const insertar = `INSERT INTO products(nameProduct, amount, notes, price) VALUES($1, $2, $3, $4) RETURNING *`;
  const randomPrice = Math.round(Math.random() * 10000, 10);

  pool
    .query(insertar, [nameProduct, amount, notes, randomPrice])
    .then((data) => {
      console.log("Product saved: ", data.rows[0]);
      res.status(201).send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "server error your data could not be saved" });
    });
});

app.put("/products/:id", function (req, res) {
  const id = req.params.id;
  const { nameProduct, amount, notes } = req.body;

  // Assuming your table has columns: nameProduct, amount, notes, price
  const updateProduct = `UPDATE products SET nameProduct = $1, amount = $2, notes = $3 WHERE id = $4 RETURNING *`;

  pool
    .query(updateProduct, [nameProduct, amount, notes, id])
    .then((data) => {
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      console.log("Product updated: ", data.rows[0]);
      res.status(200).send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Server error, could not update product" });
    });
});

  
module.exports = app;

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
