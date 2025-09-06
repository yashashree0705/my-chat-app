import { NextResponse } from "next/server";
import OpenAI from "openai";
import Stack from "../../utils/contentstack";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // 1. Fetch API config from Contentstack
    const apiEntry = await Stack.ContentType("api_configuration")
      .Entry("openai")
      .fetch();

    const openaiKey = apiEntry?.api_key || process.env.OPENAI_API_KEY;

    const client = new OpenAI({ apiKey: openaiKey });

    // 2. Fetch Knowledge Base
    const kbEntry = await Stack.ContentType("knowledge_base")
      .Entry("italy-travel-tours-complete-guide")
      .fetch();

    const knowledgeText = kbEntry?.description || "";

    // 3. Combine with user query
    const { message } = req.body;
    const prompt = `
You are a travel assistant. Use the following knowledge base:
${knowledgeText}

User question: ${message}
Answer:
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
