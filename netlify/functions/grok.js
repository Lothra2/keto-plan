// netlify/functions/grok.js
const API_URL = "https://api.x.ai/v1/chat/completions";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userPrompt = body.prompt || "Say hello from Grok-4-latest";
    const apiKey = process.env.XAI_API_KEY;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4-latest", // confirmado en tu screenshot
        messages: [
          { role: "system", content: "You are a helpful assistant that gives short, clear answers." },
          { role: "user", content: userPrompt }
        ],
        stream: false,
        temperature: 0.4
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Sin respuesta de Grok.";

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, text })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }
};
