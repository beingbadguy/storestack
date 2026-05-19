import { connectToDatabase } from "@/config/databaseConnection";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  await connectToDatabase();
  try {
    const { id } = await context.params;

    console.log("Deleting category with ID:", id);

    if (!id) {
      return NextResponse.json(
        {
          message: "Category ID is required.",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    const isCategoryExist = await Category.findById(id);

    if (!isCategoryExist) {
      return NextResponse.json(
        {
          message: "Category not found.",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Category deleted successfully.",
        success: true,
        data: [],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to delete category.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  await connectToDatabase();

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Category ID is required.",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          message: "Category not found.",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Category fetched successfully.",
        success: true,
        data: category,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Failed to fetch category.",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  await connectToDatabase();

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Category ID is required",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const { tenantId, name, description, image, isFeatured, isActive } = body;

    const isCategoryExist = await Category.findById(id);

    if (!isCategoryExist) {
      return NextResponse.json(
        {
          message: "Category not found",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        tenantId,
        name,
        description,
        image,
        isFeatured,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return NextResponse.json(
      {
        message: "Category updated successfully",
        success: true,
        data: updatedCategory,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Failed to update category",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
