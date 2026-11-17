const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const err = new Error("Invalid product ID");
    err.statusCode = 400;
    return next(err);
  }
  next();
};

module.exports = validateObjectId;
