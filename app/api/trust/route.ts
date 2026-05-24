import { connectToDatabase } from "@/config/databaseConnection";
import WebSettings from "@/models/webSettings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  try {
    const { selectedIcon, stripDescription, stripTitle, tenantId } =
      await request.json();

    if (!tenantId) {
      return NextResponse.json({
        success: false,
        message: "Error while adding this trust strip item.",
      });
    }

    if (!selectedIcon || !stripDescription || !stripTitle) {
      return NextResponse.json({
        success: false,
        message: "Icon, Description and Title is required",
      });
    }

    const strip = await WebSettings.findOne({ tenantId });
    if (!strip) {
      return NextResponse.json({
        message: "Tenant Settings not found.",
        success: false,
      });
    }
    if (strip?.trustStrips?.length >= 4) {
      return NextResponse.json({
        message: "You cannot add more than 4 Trust Strip Items.",
        success: false,
      });
    }

    const createdStrip = await WebSettings.findOneAndUpdate(
      {
        tenantId: tenantId,
      },
      {
        $push: {
          trustStrips: {
            icon: selectedIcon,
            title: stripTitle,
            subtitle: stripDescription,
          },
        },
      },
      { new: true },
    );

    if (!createdStrip) {
      return NextResponse.json({
        success: false,
        message: "Failed to add trust strip item.",
      });
    }

    return NextResponse.json(
      {
        message: "Trust Strip item added successfully.",
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Problem while adding the trust strip item",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connectToDatabase();
  try {
    const { stripId, tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json({
        success: false,
        message: "Error while adding this trust strip item.",
      });
    }

    const strip = await WebSettings.findOne({ tenantId });
    if (!strip) {
      return NextResponse.json({
        message: "Tenant Settings not found.",
        success: false,
      });
    }

    const deletedStrip = await WebSettings.findOneAndUpdate(
      {
        tenantId: tenantId,
      },
      {
        $pull: {
          trustStrips: {
            _id: stripId,
          },
        },
      },
      { new: true },
    );

    if (!deletedStrip) {
      return NextResponse.json({
        success: false,
        message: "Failed to add trust strip item.",
      });
    }

    return NextResponse.json(
      {
        message: "Trust Strip item deleted successfully.",
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Problem while adding the trust strip item",
      },
      {
        status: 500,
      },
    );
  }
}
