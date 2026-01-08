import fetch from "node-fetch";

export const callAI = async ({ userId, message, tone = "supportive", context = "" }) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in .env");
      return "AI service is not configured.";
    }

    const prompt = `
You are a compassionate mental wellness assistant.
User ID: ${userId}
Tone: ${tone}

User says: ${message}

${context ? `Conversation Context:\n${context}` : ""}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ GEMINI API ERROR:", data.error);
      return "I'm having trouble responding right now.";
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here with you.";

    return text.trim();
  } catch (err) {
    console.error("❌ Error in callAI:", err);
    return "AI is currently unavailable.";
  }
};
