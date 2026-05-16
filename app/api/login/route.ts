import { createTokenAndSetCookie } from "@/config/createTokenAndSetCookie";
import { connectToDatabase } from "@/config/databaseConnection";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Invalid email format.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found. Please sign up.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const res = NextResponse.json(
      {
        message: "Login successful.",
        success: true,
        data: {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          
        },
      },
      {
        status: 200,
      },
    );

    await createTokenAndSetCookie(user._id.toString(), res);
    return res;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occurred during login.",
        success: false,
        data: null,
      },
      {
        status: 500,
      },
    );
  }
}
