# StockSys Pro - Inventory Management System

StockSys Pro is an Inventory Management System developed for the System Integration and Architecture (SIA) project.

## Technologies Used
- HTML, CSS, JavaScript
- Node.js and Express.js
- MySQL / MariaDB
- Swagger UI
- Postman

## Features
- Inventory dashboard
- Add, view, edit, and delete products
- Stock In and Stock Out
- Stock movement history
- Low-stock monitoring
- Product search
- REST API integration

## Project Structure

- `frontend/` - User interface
- `server/` - Backend API and database connection
- `docs/` - API documentation and database export
- `package.json` - Node.js dependencies

## Installation

1. Install Node.js and XAMPP.
2. Start MySQL in XAMPP.
3. Import `docs/sia_inventory_db.sql` into MySQL.
4. Run `npm install`.
5. Copy `.env.example` to `.env` and configure database settings.
6. Run `node server/index.js`.
7. Open http://localhost:3001/

## API Documentation

- Swagger UI: http://localhost:3001/api-docs/
- OpenAPI: `docs/openapi.json`
- Postman: `docs/Inventory_Postman_Collection.json`

## Database

Database name: `sia_inventory_db`

Tables:
- `products`
- `stock_movements`

## Developer

Arjei Lacayanga
