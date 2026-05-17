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
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "agent", "staff", "superadmin"],
      default: "user",
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = models.User || model("User", userSchema);
