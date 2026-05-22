// app/api/products/route.ts

import { connectToDatabase } from "@/config/databaseConnection";
import Category from "@/models/category.model";
import Product from "@/models/products.model";
import { NextRequest, NextResponse } from "next/server";
import { SortOrder } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

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

    // VALIDATION

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          message: "Tenant ID is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Product title is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!price) {
      return NextResponse.json(
        {
          success: false,
          message: "Price is required",
        },
        {
          status: 400,
        },
      );
    }

    // CATEGORY CHECK

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        },
      );
    }

    // SKU CHECK

    if (sku) {
      const existingSKU = await Product.findOne({
        sku,
      });

      if (existingSKU) {
        return NextResponse.json(
          {
            success: false,
            message: "SKU already exists",
          },
          {
            status: 400,
          },
        );
      }
    }

    // PRICE VALIDATION

    if (compareAtPrice && compareAtPrice < price) {
      return NextResponse.json(
        {
          success: false,
          message: "Compare at price must be greater than selling price",
        },
        {
          status: 400,
        },
      );
    }

    // CREATE PRODUCT

    const product = await Product.create({
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
    });

    console.log("Category while adding the product", category);

    const updateProductCountOfCategory = await Category.findByIdAndUpdate(
      category,
      {
        $inc: {
          productCount: 1,
        },
      },
    );

    return NextResponse.json(
      {
        success: true,

        message: "Product created successfully",

        data: product,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      {
        status: 500,
      },
    );
  }
}

// GET PRODUCTS

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const tenantId = searchParams.get("tenantId");

    const page = Number(searchParams.get("page") || 1);

    const limit = Number(searchParams.get("limit") || 10);

    const search = searchParams.get("search") || "";

    const status = searchParams.get("status");

    const featured = searchParams.get("featured");

    const stock = searchParams.get("stock");

    const sortBy = searchParams.get("sortBy") || "latest";

    const skip = (page - 1) * limit;

    console.log("Tenant ID: ", tenantId);

    // QUERY

    const query: any = {
      tenantId,
      isDeleted: false,
    };

    // SEARCH

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // STATUS

    if (status && status !== "all") {
      query.status = status;
    }

    // FEATURED

    if (featured === "true") {
      query.featured = true;
    }

    // STOCK FILTER

    if (stock === "outOfStock") {
      query.stock = 0;
    }

    if (stock === "lowStock") {
      query.stock = {
        $gt: 0,
        $lt: 5,
      };
    }

    if (stock === "inStock") {
      query.stock = {
        $gte: 5,
      };
    }

    // SORT

    const sortOption: Record<string, SortOrder> =
      sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // FETCH PRODUCTS

    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // TOTAL

    const total = await Product.countDocuments(query);

    // STATS

    const stats = {
      totalProducts: await Product.countDocuments({
        tenantId,
        isDeleted: false,
      }),

      activeProducts: await Product.countDocuments({
        tenantId,
        status: "active",
        isDeleted: false,
      }),

      outOfStockProducts: await Product.countDocuments({
        tenantId,
        stock: 0,
        isDeleted: false,
      }),

      featuredProducts: await Product.countDocuments({
        tenantId,
        featured: true,
        isDeleted: false,
      }),
    };

    return NextResponse.json(
      {
        success: true,

        data: products,

        total,

        page,

        limit,

        stats,
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
        message: "Failed to fetch products",
      },
      {
        status: 500,
      },
    );
  }
}
