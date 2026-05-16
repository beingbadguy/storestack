import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    connectToDatabase();
    try {


        const { userId, slug } = await request.json();

        console.log("user id is",userId)
        console.log("slug is",slug)

        if (!userId || !slug) {
            return NextResponse.json({
                message: "User ID and slug are required",
                success: false,
                data: null,
            }, {
                status: 400
            })
        }
        
        const slugAlreadyExists = await Tenant.findOne({slug})
        if (slugAlreadyExists) {
            return NextResponse.json({
                message: "Slug already exists",
                success: false,
                data: null,
            }, {
                status: 400
            })
        }

        const tenant = await Tenant.create({
            userId,
            slug,
            sellerId: userId,
            isWebsiteLive: true
        })

        await tenant.save();
        
        return NextResponse.json({
            message: "Website deployed successfully",
            success: true,
            data: null,
        }, {
            status: 200
        })
        
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error occurred while deploying",
            success: false,
            data: null,
        }, {
            status: 500
        })
    }
}