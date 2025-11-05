// netlify/functions/gemini.js

exports.handler = async (event, context) => {
  try {
    // Si entran por GET (desde el navegador) solo decimos que está viva
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          message: "Gemini function is alive. Send POST with { prompt }."
        })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY in environment" })
      };
    }

    const finalPrompt =
      prompt ||
      "Crea una cena keto sencilla de 500-650 kcal. Dame: Título, Ingredientes y Preparación. Responde en español.";

    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        apiKey,
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

    const data = await resp.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Gemini function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Error calling Gemini API"
      })
    };
  }
};
