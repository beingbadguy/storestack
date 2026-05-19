// app/api/ai/category-description/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { categoryName } = body;

    if (!categoryName) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name required",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `Generate a professional ecommerce category description for ${categoryName} in under 60 words.`;

    const groqUrl =
      process.env.GROQ_API_URL || "https://api.groq.ai/v1/complete";
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json(
        { success: false, message: "GROQ_API_KEY not configured" },
        { status: 500 },
      );
    }

    const resp = await fetch(groqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        input: prompt,
        model: process.env.GROQ_MODEL || "groq-1",
        max_tokens: 120,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Groq error:", resp.status, text);
      return NextResponse.json(
        { success: false, message: "Groq generation failed" },
        { status: 502 },
      );
    }

    const data = await resp.json();

    // Support a few possible response shapes
    const description =
      data.output?.[0]?.content ||
      data.output ||
      data.text ||
      data.response ||
      (typeof data === "string" ? data : JSON.stringify(data));

    return NextResponse.json({ success: true, description });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate description",
      },
      {
        status: 500,
      },
    );
  }
}
