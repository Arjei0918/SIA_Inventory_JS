const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD product
router.post("/", async (req, res) => {
  try {
    const { sku, name, category, price, quantity, min_stock } = req.body;

    if (
      typeof sku !== "string" || !sku.trim() ||
      typeof name !== "string" || !name.trim() ||
      typeof category !== "string" || !category.trim() ||
      !Number.isFinite(price) || price < 0 ||
      !Number.isInteger(quantity) || quantity < 0 ||
      (min_stock !== undefined &&
        (!Number.isInteger(min_stock) || min_stock < 0))
    ) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    const [result] = await db.query(
      `INSERT INTO products
       (sku, name, category, price, quantity, min_stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sku, name, category, price, quantity, min_stock ?? 10]
    );

    res.status(201).json({
      message: "Product added successfully",
      id: result.insertId
    });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500)
      .json({ error: error.code === "ER_DUP_ENTRY"
        ? "SKU already exists" : error.message });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const { sku, name, category, price, quantity, min_stock } = req.body;

    if (
      typeof sku !== "string" || !sku.trim() ||
      typeof name !== "string" || !name.trim() ||
      typeof category !== "string" || !category.trim() ||
      !Number.isFinite(price) || price < 0 ||
      !Number.isInteger(quantity) || quantity < 0 ||
      !Number.isInteger(min_stock) || min_stock < 0
    ) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    const [result] = await db.query(
      `UPDATE products
       SET sku=?, name=?, category=?, price=?, quantity=?, min_stock=?
       WHERE id=?`,
      [sku, name, category, price, quantity, min_stock, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500)
      .json({ error: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM products WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    const conflict = [
      "ER_ROW_IS_REFERENCED",
      "ER_ROW_IS_REFERENCED_2"
    ].includes(error.code);

    res.status(conflict ? 409 : 500).json({
      error: conflict
        ? "Cannot delete a product with stock movement history"
        : error.message
    });
  }
});

module.exports = router;
