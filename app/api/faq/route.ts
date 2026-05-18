import { connectToDatabase } from "@/config/databaseConnection";
import WebSettings from "@/models/webSettings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  connectToDatabase();
  try {
    const { tenantId, question, answer } = await request.json();
    if (!tenantId || !question || !answer) {
      return NextResponse.json(
        {
          message: "Tenant ID, question and answer are required.",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    const doesTenantExist = await WebSettings.findOne({ tenantId });
    if (!doesTenantExist) {
      return NextResponse.json({
        message: "Tenant not found.",
        success: false,
      });
    }

    const newFaq = await WebSettings.findOneAndUpdate(
      {
        tenantId,
      },
      {
        $push: {
          faqs: {
            question,
            answer,
          },
        },
      },
      { new: true },
    );

    if (!newFaq) {
      return NextResponse.json(
        {
          message: "An Error occurred while saving faq.",
          success: false,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        message: "FAQ saved successfully.",
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
        message: "An Error occurred while saving faq.",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  connectToDatabase();
  try {
    const { tenantId, faqId } = await request.json();
    if (!tenantId || !faqId) {
      return NextResponse.json(
        {
          message: "Tenant ID and FAQ ID are required.",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    const doesTenantExist = await WebSettings.findOne({ tenantId });
    if (!doesTenantExist) {
      return NextResponse.json({
        message: "Tenant not found.",
        success: false,
      });
    }

    const newFaq = await WebSettings.findOneAndUpdate(
      {
        tenantId,
      },
      {
        $pull: {
          faqs: {
            _id: faqId,
          },
        },
      },
      { new: true },
    );
    if (!newFaq) {
      return NextResponse.json(
        {
          message: "An Error occurred while deleting this faq.",
          success: false,
        },
        {
          status: 500,
        },
      );
    }
    return NextResponse.json(
      {
        message: "FAQ deleted successfully.",
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
        message: "An Error occured while deleting this faq.",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
