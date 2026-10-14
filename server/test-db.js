const db = require("./config/db");

async function testConnection() {
  try {
    const [rows] = await db.query(
      "SELECT DATABASE() AS database_name"
    );

    const [products] = await db.query(
      "SELECT COUNT(*) AS total FROM products"
    );

    console.log("MySQL connected successfully!");
    console.log("Database:", rows[0].database_name);
    console.log("Total Products:", products[0].total);
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

testConnection();