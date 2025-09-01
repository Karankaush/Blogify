// app/api/ai-content/route.js
import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // ✅ Blocked words list (expandable)
    const forbiddenWords = [
      "sex", "sexual", "porn", "abuse", "violence", "murder", "kill",
      "drugs", "terror", "hate", "racist", "nude", "crime", "criminal"
    ];

    const lowerTitle = title.toLowerCase();

    if (forbiddenWords.some((word) => lowerTitle.includes(word))) {
      return NextResponse.json(
        { success: false, error: "This title contains prohibited content." },
        { status: 400 }
      );
    }

    // ✅ Free & fast model
    const model = getGeminiModel("gemini-1.5-flash");

    const result = await model.generateContent(
      `Write a clean, safe and engaging blog-style article on: "${title}".
      Make it easy to understand for a general audience with no technical background.
   Use simple everyday English, short sentences, and clear explanations.
   Avoid complex or academic words, and explain ideas in a friendly and engaging tone.
   The goal is that even a beginner or casual reader can easily follow and enjoy the content. 
      The content must not contain adult, violent, hateful, or criminal themes.`
    );

    let aiText = result.response.text();

    // ✅ Check length (max 1000 chars)
    // if (aiText.length > 2000) {
    //   return NextResponse.json(
    //     { success: false, error: "Generated content is too long (max 1000 chars)" },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json({ success: true, suggestedContent: aiText });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { success: false, error: "AI generation failed" },
      { status: 500 }
    );
  }
}
