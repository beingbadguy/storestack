import mongoose, { Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    // MULTI TENANT
    tenantId: {
      type: Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    brand: {
      type: String,
      index: true,
    },

    // CATEGORY
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // PRICING
    price: {
      type: Number,
      required: true,
    },

    compareAtPrice: {
      type: Number,
    },

    costPrice: {
      type: Number,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // INVENTORY
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    trackQuantity: {
      type: Boolean,
      default: true,
    },

    // MEDIA
    images: [String],

    thumbnail: {
      type: String,
    },

    // VARIANTS
    variants: [
      {
        name: String, // Size, Color
        value: String, // XL, Red
        price: Number,
        stock: Number,
        sku: String,
      },
    ],

    // ATTRIBUTES / FILTERS
    attributes: {
      type: Map,
      of: String,
    },

    // SHIPPING
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // SEO
    metaTitle: String,
    metaDescription: String,

    // STATUS
    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "draft",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // ANALYTICS
    views: {
      type: Number,
      default: 0,
    },

    salesCount: {
      type: Number,
      default: 0,
    },

    // RATINGS
    averageRating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    // TAGS
    tags: [String],

    // SOFT DELETE
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
