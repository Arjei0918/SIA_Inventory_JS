const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const productRoutes = require("./routes/products");
const stockRoutes = require("./routes/stock");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "OK", database: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      database: "disconnected"
    });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);


const path = require("path");

app.use(express.static(
  path.join(__dirname, "../frontend")
));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/index.html")
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Inventory API running at http://localhost:${PORT}`);
});
