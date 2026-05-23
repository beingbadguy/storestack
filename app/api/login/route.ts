import { createTokenAndSetCookie } from "@/config/createTokenAndSetCookie";
import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
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

    const domainOrigin = request.headers.get("host");

    console.log(domainOrigin, " this is the domainOrigin");
    const tenant = await Tenant.findOne({ slug: domainOrigin?.split(".")[0] });

    console.log(tenant, "this is the tenant information");

    let isUserTenant = true;
    if (tenant) {
      console.log("he is a customer");
      isUserTenant = false;
    }

    // if (
    //   !isUserTenant &&
    //   (request.headers.get("host")?.includes("storestack.vercel.app") ||
    //     request.headers.get("host") === "localhost:3000")
    // ) {
    //   console.log(
    //     "you are a customer and trying to log in to the admin dashboard.",
    //   );
    //   return NextResponse.json(
    //     {
    //       message: "Invalid Credentials. (unauthorised)",
    //       success: false,
    //     },
    //     {
    //       status: 401,
    //     },
    //   );
    // }

    const user = await User.findOne({
      email,
      tenantId: isUserTenant ? null : tenant._id,
    });
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
