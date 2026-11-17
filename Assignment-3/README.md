# Inventory & Data Management System

REST API built with Node.js, Express, MongoDB (Mongoose) and dotenv.

## Setup (VSCodium + MongoDB Atlas)

1. Open this folder in VSCodium (File > Open Folder), then open the terminal (Ctrl+`).
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and put your Atlas connection string in `MONGO_URI`:
   - Atlas web console > your cluster > **Connect** > **Drivers** > copy the string
   - Replace `<username>` and `<password>` with your database user's credentials
   - Atlas > **Network Access** > allow your IP address (or `0.0.0.0/0` for the lab)
   - Keep `/inventoryDB` in the string; that is the database name
4. (Optional) Load 12 sample products so the screenshots match the assignment:
   ```
   npm run seed
   ```
5. Start the server:
   ```
   npm start
   ```
   Server runs at http://localhost:5000

## Endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| POST | /api/products | Create product |
| GET | /api/products | List with filter, sort, pagination |
| GET | /api/products/:id | Get one product |
| PUT | /api/products/:id | Update product details |
| PATCH | /api/products/:id/stock | Restock / sale: `{ "change": 10 }` or `{ "change": -3 }` |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/low-stock | Products where quantity <= reorderLevel |
| GET | /api/products/summary | Category-wise summary (aggregation) |

### Query parameters for GET /api/products

`category`, `supplier`, `search` (name), `minPrice`, `maxPrice`, `inStock=true|false`,
`sort=-price,name`, `page=1`, `limit=10`

Example: `/api/products?category=Electronics&minPrice=500&sort=-price&page=1&limit=5`

### Sample POST body

```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 120,
  "quantity": 40,
  "reorderLevel": 20,
  "supplier": "Cello Pens"
}
```

## Project structure

```
config/db.js                  MongoDB connection
models/Product.js             Schema, validation, stockValue virtual
controllers/productController.js
routes/productRoutes.js
middleware/                   errorHandler, validateObjectId, asyncHandler
seed.js                       Sample data
server.js                     App entry point
```
