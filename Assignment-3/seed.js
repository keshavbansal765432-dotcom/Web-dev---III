// Run with: npm run seed   (inserts 12 sample products - clears existing ones first)
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  { name: "Study Table", sku: "FURN-TB-812", category: "Furniture", price: 3999, quantity: 2, reorderLevel: 4, supplier: "IKEA India" },
  { name: "Office Chair", sku: "FURN-CH-101", category: "Furniture", price: 6499, quantity: 15, reorderLevel: 5, supplier: "Godrej Interio" },
  { name: "Bookshelf", sku: "FURN-BS-220", category: "Furniture", price: 4599, quantity: 3, reorderLevel: 5, supplier: "IKEA India" },
  { name: "Wireless Mouse", sku: "ELEC-MS-001", category: "Electronics", price: 799, quantity: 40, reorderLevel: 15, supplier: "Logitech" },
  { name: "Mechanical Keyboard", sku: "ELEC-KB-002", category: "Electronics", price: 3499, quantity: 25, reorderLevel: 10, supplier: "Keychron" },
  { name: "27-inch Monitor", sku: "ELEC-MN-003", category: "Electronics", price: 15999, quantity: 6, reorderLevel: 8, supplier: "Dell India" },
  { name: "USB-C Hub", sku: "ELEC-HB-004", category: "Electronics", price: 1999, quantity: 25, reorderLevel: 10, supplier: "Anker" },
  { name: "Cotton T-Shirt", sku: "APRL-TS-301", category: "Apparel", price: 499, quantity: 60, reorderLevel: 20, supplier: "Allen Solly" },
  { name: "Denim Jacket", sku: "APRL-JK-302", category: "Apparel", price: 2299, quantity: 18, reorderLevel: 8, supplier: "Levis India" },
  { name: "Notebook A4 (Pack of 5)", sku: "STNY-NB-501", category: "Stationery", price: 250, quantity: 8, reorderLevel: 20, supplier: "Classmate" },
  { name: "Ball Pen Box of 50", sku: "STNY-PN-502", category: "Stationery", price: 300, quantity: 70, reorderLevel: 25, supplier: "Reynolds" },
  { name: "Basmati Rice 5kg", sku: "GROC-RC-701", category: "Grocery", price: 650, quantity: 30, reorderLevel: 12, supplier: "India Gate" },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
