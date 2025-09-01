
import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content || content.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: "Content is too short to summarize." },
        { status: 400 }
      );
    }

    const model = getGeminiModel("gemini-1.5-flash");

    const result = await model.generateContent(
      `Summarize the following blog content in 40% of given content length,  simple sentences that anyone can easily understand. 
      Content: """${content}""" `
    );

    const summary = result.response.text();

    return NextResponse.json({ success: true, summary });
  } catch (error) {
  // console.error(" Summarize API Error:", error);

  return NextResponse.json(
    {
      success: false,
      error: error.message || "AI summarization failed",
    },
    { status: 500 }
  );
}

}
