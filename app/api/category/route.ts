import { connectToDatabase } from "@/config/databaseConnection";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  connectToDatabase();
  try {
    const params = new URL(request.url);

    const page = params.searchParams.get("page") || 1;
    const limit = params.searchParams.get("limit") || 10;
    const search = params.searchParams.get("search") || "";
    const status = params.searchParams.get("status") || "all";
    const isFeatured = params.searchParams.get("isFeatured") || "all";
    const sortBy = params.searchParams.get("sortBy") || "latest";

    const skip = (Number(page) - 1) * Number(limit);

    const tenantId = params.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({
        message: "Tenant ID is required",
        success: false,
      });
    }

    const query: any = { tenantId };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (status === "active") {
      query.isActive = true;
    }
    if (status === "inactive") {
      query.isActive = false;
    }
    if (isFeatured === "true") {
      query.isFeatured = true;
    }
    const categories = await Category.find(query)
      .sort({ createdAt: sortBy === "latest" ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));
    const totalCategories = await Category.countDocuments(query);

    const activeCategoriesCount = await Category.countDocuments({
      tenantId,
      isActive: true,
    });
    const inactiveCategoriesCount = await Category.countDocuments({
      tenantId,
      isActive: false,
    });
    const featuredCategoriesCount = await Category.countDocuments({
      tenantId,
      isFeatured: true,
    });

    return NextResponse.json(
      {
        message: "Categories fetched successfully",
        success: true,
        data: categories,
        total: totalCategories,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalCategories / Number(limit)),
        },
        stats: {
          totalCategories: totalCategories,
          totalActiveCategories: activeCategoriesCount,
          totalInactiveCategories: inactiveCategoriesCount,
          totalFeaturedCategories: featuredCategoriesCount,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to fetch categories",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  connectToDatabase();
  try {
    const body = await request.json();
    const { tenantId, name, description, image, isFeatured } = body;

    if (!tenantId || !name || !image) {
      return NextResponse.json(
        { message: "Tenant ID, name, and image are required", success: false },
        { status: 400 },
      );
    }

    const category = await Category.create({
      tenantId,
      name,
      description,
      image,
      isFeatured,
    });
    return NextResponse.json(
      {
        message: "Category created successfully",
        success: true,
        data: category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create category", success: false },
      { status: 500 },
    );
  }
}
