import { createTokenAndSetCookie } from "@/config/createTokenAndSetCookie";
import { connectToDatabase } from "@/config/databaseConnection";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      countryCode,
      mobile,
      origin,
    } = body;
    console.log(body);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !countryCode ||
      !mobile
    ) {
      return NextResponse.json(
        {
          message: "All fields are required.",
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

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return NextResponse.json(
        {
          message: "User with this email already exists.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters long.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    if (confirmPassword !== password) {
      return NextResponse.json(
        {
          message: "Password and confirm password do not match.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        {
          message: "Invalid mobile number format.",
          success: false,
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    // hash the password and save the user to the database here

    // hash the password and save the user to the database here

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      countryCode,
      mobile,
      role: origin === "admin" ? "agent" : "user",
    });
    await newUser.save();

    // send mail to the user to verify their email address here

    // createTokenAndSetCookie function should be called here to set the token in the cookie

    const user = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    };

    const res = NextResponse.json(
      {
        message: "Signup Successfull.",
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

    console.log("==THIS IS THE NEW RESPONSE==", NextResponse);
    await createTokenAndSetCookie(newUser, res);
    return res;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occurred during signup.",
        success: false,
        data: null,
      },
      {
        status: 500,
      },
    );
  }
}
