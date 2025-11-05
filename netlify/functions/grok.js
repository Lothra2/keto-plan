// netlify/functions/grok.js

const API_URL = "https://api.x.ai/v1/chat/completions";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userPrompt =
      body.prompt ||
      "Create 1 short keto dinner (title, ingredients, instructions) in Spanish.";

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: "XAI_API_KEY no está configurada en Netlify."
        })
      };
    }

    // 👇 esto es tal cual lo que te mostró xAI en su panel
    const xaiRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a test assistant."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        model: "grok-4-latest",
        stream: false,
        temperature: 0
      })
    });

    const data = await xaiRes.json();

    // si xAI devolvió error (401, 403, etc.)
    if (!xaiRes.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: data.error || "Error desde xAI",
          raw: data
        })
      };
    }

    // formato tipo OpenAI
    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Grok no devolvió contenido.";

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        text,
        raw: data
      })
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: false,
        error: err.message
      })
    };
  }
};
