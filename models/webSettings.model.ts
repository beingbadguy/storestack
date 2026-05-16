import mongoose from "mongoose";

const webSettingsSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
        unique: true
    },
    // General Information
    websiteName: { type: String, default: "My E-commerce Store" },
    websiteTitle: { type: String, default: "Experience Exceptional Shopping" },
    siteDescription: { type: String, default: "Browse premium products and make confident shopping decisions." },
    featuredListingsCount: { type: Number, default: 4 },
    showSearchbar: { type: Boolean, default: true },
    
    // Theme & Navigation
    theme: { type: String, default: "teal-white" },
    navbarLayout: { type: String, default: "minimal" },
    footerLayout: { type: String, default: "multicolumn" },
    
    // Media & Branding
    siteFavicon: { type: String, default: "" },
    footerLogo: { type: String, default: "" },
    siteLogoLight: { type: String, default: "" },
    siteLogoDark: { type: String, default: "" },
    bannerType: { type: String, enum: ["image", "videobackground", "slider"], default: "image" },
    videoBackgroundLink: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    videoBackground: { type: String, default: "" },
    navbarBackgroundImage: { type: String, default: "" },
    footerBackgroundImage: { type: String, default: "" },
    sliderImages: [{ type: String }],
    
    // Contact Information
    contactEmail: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    city: { type: String, default: "" },
    businessAddress: { type: String, default: "" },
    
    // Coordinates
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    
    // Social Links
    socialLinks: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        youtube: { type: String, default: "" }
    },
    
    // Legal & Compliance
    enableCookieConsent: { type: Boolean, default: true },
    cookiePosition: { type: String, enum: ["top", "bottom"], default: "bottom" },
    cookieText: { type: String, default: "We use cookies to improve your experience." },
    showCopyright: { type: Boolean, default: true },
    copyrightLink: { type: String, default: "" },

}, { timestamps: true });

const WebSettings = mongoose.models.WebSettings || mongoose.model("WebSettings", webSettingsSchema);

export default WebSettings;
