import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, responseLength } = await req.json();

    // Build a system instruction that adapts to the user's response length preference.
    let systemContent = "You are a helpful, highly competent AI assistant. Keep tone professional and helpful.";

    if (responseLength === "short") {
      systemContent += " Prefer short, focused responses. When helpful, provide a one-line summary followed by 2–4 bullet points. Avoid unnecessary filler.";
    } else if (responseLength === "detailed") {
      systemContent += " Provide detailed, thorough explanations when appropriate. Include step-by-step guidance, examples, and reasoning. Use headings and numbered lists where it improves clarity.";
    } else {
      systemContent += " Balance brevity and helpfulness appropriately.";
    }

    const systemMessage = { role: "system", content: systemContent };

    const adjustedMessages = [systemMessage, ...messages];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: adjustedMessages,
      // Lower temperature for more deterministic, crisp answers
      temperature: 0.2,
      // Adjust token cap slightly based on desired detail
      max_completion_tokens: responseLength === "detailed" ? 2048 : 1024,
      top_p: 0.9,
      stream: true,
      stop: null,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
