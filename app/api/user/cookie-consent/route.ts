import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/databaseConnection";
import { User } from "@/models/user.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { userId, hasAcceptedCookies } = body;

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { hasAcceptedCookies },
            { new: true }
        );

        if (!user) {
             return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
