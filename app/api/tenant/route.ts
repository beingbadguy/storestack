import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    connectToDatabase();
    try {


        const res = new URL(request.url);
        console.log(res);

        const sellerId = res.searchParams.get("sellerId");
        console.log(sellerId)

        const isSellerExists = await Tenant.findOne({userId: sellerId})
        if (!isSellerExists) {
            return NextResponse.json({
                message: "Seller does not exist",
                success: false,
                data: null,
            }, {
                status: 404
            })
        }


     

        // if (!sellerId) {
        //     return NextResponse.json({
        //         message: "User ID and slug are required",
        //         success: false,
        //         data: null,
        //     }, {
        //         status: 400
        //     })
        // }
        
        // const slugAlreadyExists = await Tenant.findOne({slug})
        // if (slugAlreadyExists) {
        //     return NextResponse.json({
        //         message: "Slug already exists",
        //         success: false,
        //         data: null,
        //     }, {
        //         status: 400
        //     })
        // }

        
        
        return NextResponse.json({
            message: "Tenant details fetched successfully",
            success: true,
            data: isSellerExists,    
        }, {
            status: 200
        })
        
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error occurred while getting tenant details",
            success: false,
            data: null,
        }, {
            status: 500
        })
    }
}