import fetch from "node-fetch";

export const generateAIInsights = async (text) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in .env");
      return {
        summary: "",
        suggestions: [],
        sentimentScore: 0,
        sentimentLabel: "neutral",
      };
    }

    const prompt = `
You are a compassionate mental wellness AI assistant.

Analyze the following journal entry and return:
1. A short emotional summary (2–3 lines)
2. Exactly 3 supportive self-care suggestions
3. A sentiment score between -1 (negative) and +1 (positive)
4. A sentiment label: positive, negative, or neutral

Journal Entry:
"${text}"

Respond ONLY in valid JSON format:
{
  "summary": "",
  "suggestions": [],
  "sentimentScore": 0,
  "sentimentLabel": ""
}
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
      return {
        summary: "",
        suggestions: [],
        sentimentScore: 0,
        sentimentLabel: "neutral",
      };
    }

    let textResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🧹 Clean markdown if Gemini adds it
    textResponse = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(textResponse);

    return {
      summary: parsed.summary || "",
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : [],
      sentimentScore: Number(parsed.sentimentScore) || 0,
      sentimentLabel: parsed.sentimentLabel || "neutral",
    };

  } catch (err) {
    console.error("❌ Error in generateAIInsights:", err);
    return {
      summary: "",
      suggestions: [],
      sentimentScore: 0,
      sentimentLabel: "neutral",
    };
  }
};

export const generateWeeklyInsights = async (entries) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey || !entries.length) {
      return null;
    }

    const journalText = entries
      .map(
        (e, i) =>
          `Day ${i + 1} | Mood: ${e.mood} | Sentiment: ${e.sentimentLabel}\nEntry: ${e.entryText}`
      )
      .join("\n\n");

    const prompt = `
You are an empathetic mental wellness AI.

Based on the following 7-day journal entries:
1. Identify emotional patterns
2. Describe overall mental trend
3. Highlight dominant moods
4. Give 3 personalized recommendations for the coming week

Journal Entries:
${journalText}

Respond ONLY in valid JSON:
{
  "summary": "",
  "dominantMoods": [],
  "mentalTrend": "",
  "recommendations": []
}
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

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);
    console.log("sumaary: ",parsed.summary);
    return {
      summary: parsed.summary || "",
      dominantMoods: parsed.dominantMoods || [],
      mentalTrend: parsed.mentalTrend || "",
      recommendations: parsed.recommendations || [],
    };

  } catch (err) {
    console.error("❌ Weekly AI Insight Error:", err);
    return null;
  }
};
