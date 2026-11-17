const express = require("express");
const c = require("../controllers/productController");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// Static routes must come before "/:id"
router.get("/low-stock", c.getLowStock);
router.get("/summary", c.getCategorySummary);

router.route("/").get(c.getProducts).post(c.createProduct);

router
  .route("/:id")
  .get(validateObjectId, c.getProductById)
  .put(validateObjectId, c.updateProduct)
  .delete(validateObjectId, c.deleteProduct);

router.patch("/:id/stock", validateObjectId, c.adjustStock);

module.exports = router;
