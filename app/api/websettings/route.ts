import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/databaseConnection";
import WebSettings from "@/models/webSettings.model";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const tenantId = url.searchParams.get("tenantId");

        if (!tenantId) {
            return NextResponse.json({ success: false, message: "Tenant ID is required" }, { status: 400 });
        }

        let settings = await WebSettings.findOne({ tenantId });
        
        if (!settings) {
            settings = await WebSettings.create({ tenantId });
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { tenantId, ...updateData } = body;

        if (!tenantId) {
            return NextResponse.json({ success: false, message: "Tenant ID is required" }, { status: 400 });
        }

        const settings = await WebSettings.findOneAndUpdate(
            { tenantId },
            { $set: updateData },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: settings, message: "Settings updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
