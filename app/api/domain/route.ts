import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    connectToDatabase()
    
    try {
        const res = new URL(request.url)
        const domain = res.searchParams.get("domain");
        const alreadyExists =await Tenant.findOne({slug: domain});
        
        if(alreadyExists){
            return NextResponse.json({
                message: "Domain already exists",
                success: false,
                data: null,
            }, {
                status:200
            })
        }

        return NextResponse.json({
            message: "Domain is available",
            success: true,
            data: null,
        }, {
            status:200
        })
        
        
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            success: false,
            data: null,
        },
            {
            status:500
        })
    }
}