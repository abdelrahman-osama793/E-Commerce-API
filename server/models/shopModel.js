const mongoose = require("mongoose");

const shopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    vatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    staff: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }],
    description: {
      type: String,
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopRating",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    Approved: {
      type: Boolean,
      default: false,
    },
    Blocked: {
      value: {
        type: Boolean,
        default: false,
      },
      reason: String,
    }
  }
)

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;