const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, p.name AS product_name, p.sku
      FROM stock_movements m
      JOIN products p ON m.product_id = p.id
      ORDER BY m.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function moveStock(req, res, type) {
  const { product_id, quantity, remarks = "" } = req.body;

  if (!Number.isInteger(product_id) || product_id <= 0 ||
      !Number.isInteger(quantity) || quantity <= 0 ||
      typeof remarks !== "string" || remarks.length > 255) {
    return res.status(400).json({ error: "Invalid stock data" });
  }

  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT quantity FROM products WHERE id = ? FOR UPDATE",
      [product_id]
    );

    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ error: "Product not found" });
    }

    const current = rows[0].quantity;

    if (type === "OUT" && current < quantity) {
      await conn.rollback();
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const updated = type === "IN"
      ? current + quantity
      : current - quantity;

    if (!Number.isSafeInteger(updated) || updated > 2147483647) {
      await conn.rollback();
      return res.status(400).json({ error: "Stock quantity exceeds limit" });
    }

    await conn.query(
      "UPDATE products SET quantity = ? WHERE id = ?",
      [updated, product_id]
    );

    await conn.query(
      `INSERT INTO stock_movements
       (product_id, movement_type, quantity, remarks)
       VALUES (?, ?, ?, ?)`,
      [product_id, type, quantity, remarks]
    );

    await conn.commit();

    res.status(201).json({
      message: `Stock ${type} successful`,
      product_id,
      new_quantity: updated
    });

  } catch (error) {
    if (conn) await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
}

router.post("/in", (req, res) => moveStock(req, res, "IN"));
router.post("/out", (req, res) => moveStock(req, res, "OUT"));

module.exports = router;
