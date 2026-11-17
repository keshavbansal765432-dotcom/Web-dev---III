const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, price, quantity, reorderLevel, supplier } = req.body;
  const product = await Product.create({
    name,
    sku,
    category,
    price,
    quantity,
    reorderLevel,
    supplier,
  });
  res.status(201).json(product);
});

// GET /api/products
// Query: category, supplier, search, minPrice, maxPrice, inStock=true,
//        sort=-price,name  page=1  limit=10
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, supplier, search, minPrice, maxPrice, inStock } = req.query;
  const filter = {};

  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  if (supplier) filter.supplier = new RegExp(`^${escapeRegex(supplier)}$`, "i");
  if (search) filter.name = new RegExp(escapeRegex(search), "i");

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) {
      if (isNaN(minPrice)) throw httpError(400, "minPrice must be a number");
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      if (isNaN(maxPrice)) throw httpError(400, "maxPrice must be a number");
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (inStock === "true") filter.quantity = { $gt: 0 };
  if (inStock === "false") filter.quantity = 0;

  const sortBy = req.query.sort ? req.query.sort.split(",").join(" ") : "-createdAt";

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sortBy).skip(skip).limit(limit),
  ]);

  res.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    count: products.length,
    products,
  });
});

// GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json(product);
});

// PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const allowed = ["name", "sku", "category", "price", "quantity", "reorderLevel", "supplier"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!product) throw httpError(404, "Product not found");
  res.json(product);
});

// PATCH /api/products/:id/stock   body: { "change": 10 } (restock) or { "change": -3 } (sale)
exports.adjustStock = asyncHandler(async (req, res) => {
  const { change } = req.body;

  if (typeof change !== "number" || !Number.isInteger(change) || change === 0) {
    throw httpError(400, "'change' must be a non-zero whole number");
  }

  // Atomic: for a sale, only match if enough stock exists, so quantity never goes negative
  const filter = { _id: req.params.id };
  if (change < 0) filter.quantity = { $gte: -change };

  const product = await Product.findOneAndUpdate(
    filter,
    { $inc: { quantity: change } },
    { new: true, runValidators: true }
  );

  if (!product) {
    const exists = await Product.exists({ _id: req.params.id });
    if (!exists) throw httpError(404, "Product not found");
    throw httpError(400, "Insufficient stock for this sale");
  }

  res.json({ message: "Stock updated", product });
});

// DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json({ message: "Product deleted", id: product.id });
});

// GET /api/products/low-stock  -> quantity <= reorderLevel
exports.getLowStock = asyncHandler(async (req, res) => {
  const lowStockItems = await Product.find({
    $expr: { $lte: ["$quantity", "$reorderLevel"] },
  }).sort("quantity");

  res.json({ count: lowStockItems.length, lowStockItems });
});

// GET /api/products/summary  -> category-wise aggregation
exports.getCategorySummary = asyncHandler(async (req, res) => {
  const summary = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        avgPrice: { $avg: "$price" },
      },
    },
    {
      $project: {
        totalItems: 1,
        totalQuantity: 1,
        totalStockValue: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
      },
    },
    { $sort: { totalStockValue: -1 } },
  ]);

  res.json({ categories: summary.length, summary });
});
