import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true },
);

const webSettingsSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      unique: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
    },
    // General Information
    brandName: { type: String, default: "My Store" },
    websiteTitle: { type: String, default: "Experience Exceptional Shopping" },
    siteDescription: {
      type: String,
      default: "Browse premium products and make confident shopping decisions.",
    },
    websiteDescription: {
      type: String,
      default: "Your premium destination for fashion and lifestyle.",
    },

    // showSearchbar: { type: Boolean, default: true },

    // Theme & Navigation
    theme: { type: String, default: "teal-white" },
    navbarLayout: { type: String, default: "minimal" },
    footerLayout: { type: String, default: "multicolumn" },

    // Media & Branding
    siteFavicon: { type: String, default: "" },
    footerLogo: { type: String, default: "" },
    siteLogoLight: { type: String, default: "" },
    siteLogoDark: { type: String, default: "" },

    // hero section info
    isBannerEnabled: { type: Boolean, default: false },
    bannerType: {
      type: String,
      enum: ["image", "video", "slider", "custom"],
      default: "custom",
    },

    bannerTitle: { type: String, default: "" },
    bannerDescription: { type: String, default: "" },
    videoBackgroundLink: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    videoBackground: { type: String, default: "" },
    sliderImages: [{ type: String }],

    // Contact Information
    contactEmail: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    city: { type: String, default: "" },
    businessAddress: { type: String, default: "" },

    // Social Links
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // Legal & Compliance
    enableCookieConsent: { type: Boolean, default: true },
    cookiePosition: {
      type: String,
      enum: ["top", "bottom"],
      default: "bottom",
    },
    cookieText: {
      type: String,
      default: "We use cookies to improve your experience.",
    },
    showCopyright: { type: Boolean, default: true },
    copyrightLink: { type: String, default: "" },

    enableNewsletter: { type: Boolean, default: false },
    newsletterText: {
      type: String,
      default: "Receive new updates delivered straight to your inbox.",
    },
    newsletterTitle: { type: String, default: "Sign Up For Our Newsletter" },

    // faq
    faqs: [faqSchema],
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.WebSettings;
}

const WebSettings =
  mongoose.models.WebSettings ||
  mongoose.model("WebSettings", webSettingsSchema);

export default WebSettings;
