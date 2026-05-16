import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Logout API called");

    const response = await NextResponse.json(
      {
        data: null,
        message: "User logged out successfully.",
        success: true,
      },
      {
        status: 200,
      },
    );

    response.cookies.set("storestack", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      {
        data: null,
        message: "An error occurred during logout.",
        success: false,
      },
      { status: 500 },
    );
  }
}
