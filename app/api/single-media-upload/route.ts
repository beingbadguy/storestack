import cloudinary from "@/config/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json({
        message: "No file found",
        success: false,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "store_stack",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        success: true,
        data: result.secure_url,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An Error occured while uploading the image",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
