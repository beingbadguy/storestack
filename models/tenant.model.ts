import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tenantId: {
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    },
    
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isWebsiteLive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "banned"],
      default: "pending",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
