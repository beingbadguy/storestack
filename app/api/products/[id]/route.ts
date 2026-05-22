import { connectToDatabase } from "@/config/databaseConnection";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/products.model";
import Category from "@/models/category.model";

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
    console.log("Received request to fetch product with ID:", id);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required to fetch this product details.",
        },
        {
          status: 400,
        },
      );
    }

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "No product found with this ID.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
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
        message: "Problem while fetching this product.",
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

    // PRODUCT ID VALIDATION

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const {
      tenantId,
      title,
      description,
      brand,
      category,
      price,
      compareAtPrice,
      costPrice,
      stock,
      sku,
      featured,
      status,
      images,
      thumbnail,
      metaTitle,
      metaDescription,
    } = body;

    // TENANT VALIDATION

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          message: "Tenant ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    // PRODUCT EXISTENCE CHECK

    const existingProduct = await Product.findOne({
      _id: id,
      tenantId,
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        },
      );
    }

    // CONDITIONAL VALIDATIONS

    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (category !== undefined) {
      const categoryExists = await Category.findOne({
        _id: category,
        tenantId,
      });

      if (!categoryExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Category not found.",
          },
          {
            status: 404,
          },
        );
      }
    }

    if (price !== undefined && price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      compareAtPrice !== undefined &&
      price !== undefined &&
      compareAtPrice < price
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Compare at price must be greater than selling price.",
        },
        {
          status: 400,
        },
      );
    }

    // BUILD UPDATE OBJECT DYNAMICALLY

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;

    if (description !== undefined) updateData.description = description;

    if (brand !== undefined) updateData.brand = brand;

    if (category !== undefined) updateData.category = category;

    if (price !== undefined) updateData.price = price;

    if (compareAtPrice !== undefined)
      updateData.compareAtPrice = compareAtPrice;

    if (costPrice !== undefined) updateData.costPrice = costPrice;

    if (stock !== undefined) updateData.stock = stock;

    if (sku !== undefined) updateData.sku = sku;

    if (featured !== undefined) updateData.featured = featured;

    if (status !== undefined) updateData.status = status;

    if (images !== undefined) updateData.images = images;

    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;

    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;

    // UPDATE PRODUCT

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: id,
        tenantId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).populate("category", "name");

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
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
        message: "Problem while updating this product.",
      },
      {
        status: 500,
      },
    );
  }
}