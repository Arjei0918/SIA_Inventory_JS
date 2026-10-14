const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "SIA Inventory Management API",
      version: "1.0.0",
      description: "Inventory Management System using Node.js, Express and MySQL"
    },
    servers: [
      { url: "http://localhost:3001" }
    ],
    tags: [
      { name: "Products", description: "Product management" },
      { name: "Stock", description: "Stock movements" },
      { name: "System", description: "API health" }
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Check API and database health",
          responses: {
            200: { description: "System healthy" },
            503: { description: "Database unavailable" }
          }
        }
      },
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "Get all products",
          responses: {
            200: { description: "List of products" }
          }
        },
        post: {
          tags: ["Products"],
          summary: "Create product",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" }
              }
            }
          },
          responses: {
            201: { description: "Product created" },
            400: { description: "Invalid input" },
            409: { description: "Duplicate SKU" }
          }
        }
      },
      "/api/products/{id}": {
        parameters: [{
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }],
        get: {
          tags: ["Products"],
          summary: "Get product by ID",
          responses: {
            200: { description: "Product found" },
            404: { description: "Product not found" }
          }
        },
        put: {
          tags: ["Products"],
          summary: "Update product",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" }
              }
            }
          },
          responses: {
            200: { description: "Product updated" },
            400: { description: "Invalid input" },
            404: { description: "Product not found" }
          }
        },
        delete: {
          tags: ["Products"],
          summary: "Delete product",
          responses: {
            200: { description: "Product deleted" },
            404: { description: "Product not found" },
            409: { description: "Product has movement history" }
          }
        }
      },
      "/api/stock": {
        get: {
          tags: ["Stock"],
          summary: "Get stock movement history",
          responses: {
            200: { description: "Stock movement list" }
          }
        }
      },
      "/api/stock/in": {
        post: {
          tags: ["Stock"],
          summary: "Stock In",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StockInput" }
              }
            }
          },
          responses: {
            201: { description: "Stock received" },
            400: { description: "Invalid stock data" },
            404: { description: "Product not found" }
          }
        }
      },
      "/api/stock/out": {
        post: {
          tags: ["Stock"],
          summary: "Stock Out",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StockInput" }
              }
            }
          },
          responses: {
            201: { description: "Stock released" },
            400: { description: "Invalid or insufficient stock" },
            404: { description: "Product not found" }
          }
        }
      }
    },
    components: {
      schemas: {
        ProductInput: {
          type: "object",
          required: ["sku", "name", "category", "price", "quantity"],
          properties: {
            sku: { type: "string", example: "INV006" },
            name: { type: "string", example: "Marker" },
            category: { type: "string", example: "School Supplies" },
            price: { type: "number", minimum: 0, example: 35 },
            quantity: { type: "integer", minimum: 0, example: 50 },
            min_stock: { type: "integer", minimum: 0, example: 10 }
          }
        },
        StockInput: {
          type: "object",
          required: ["product_id", "quantity"],
          properties: {
            product_id: { type: "integer", example: 1 },
            quantity: { type: "integer", minimum: 1, example: 10 },
            remarks: { type: "string", example: "New stock delivery" }
          }
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
