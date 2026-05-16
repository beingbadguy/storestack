//it contains the details of the slug or domain taken or not

import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
        default: false
    },
    

});

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;