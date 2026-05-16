import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/databaseConnection";
export async function GET() {
    await connectToDatabase();
    
    

  return NextResponse.json({
    message: "Hello, World!",
    success: true,
    data: null,
  });
}
