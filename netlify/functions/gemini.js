// netlify/functions/gemini.js
export async function handler(event, context) {
  try {
    // 1) si es GET solo respondemos que está viva
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: "Gemini function is alive. Use POST with {prompt}." })
      };
    }

    // 2) para POST, leemos el prompt
    const { prompt } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY in environment" })
      };
    }

    // si no mandaron prompt, ponemos uno por defecto
    const finalPrompt =
      prompt ||
      "Crea una cena keto sencilla de 500-650 kcal. Dame: Título, Ingredientes y Preparación. Responde en español.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: finalPrompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Gemini error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Error calling Gemini API" })
    };
  }
}
// netlify/functions/gemini.js
export async function handler(event, context) {
  try {
    // 1) si es GET solo respondemos que está viva
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: "Gemini function is alive. Use POST with {prompt}." })
      };
    }

    // 2) para POST, leemos el prompt
    const { prompt } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY in environment" })
      };
    }

    // si no mandaron prompt, ponemos uno por defecto
    const finalPrompt =
      prompt ||
      "Crea una cena keto sencilla de 500-650 kcal. Dame: Título, Ingredientes y Preparación. Responde en español.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: finalPrompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Gemini error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Error calling Gemini API" })
    };
  }
}
