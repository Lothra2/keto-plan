export async function handler(event, context) {
  try {
    const { prompt } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Gemini error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error calling Gemini API" })
    };
  }
}

