import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    countryCode: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["customer", "tenant", "staff", "superadmin"],
      default: "customer",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiresIn: {
      type: Date,
    },
    mobileVerificationToken: {
      type: String,
    },
    mobileVerificationTokenExpiresIn: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiresIn: {
      type: Date,
    },
    accessToken: {
      type: String,
    },
    hasAcceptedCookies: {
      type: Boolean,
      default: false,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = models.User || model("User", userSchema);
