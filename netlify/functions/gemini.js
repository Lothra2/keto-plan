// netlify/functions/gemini.js
exports.handler = async (event, context) => {
  try {
    // 1) Si alguien entra con GET en el navegador, solo respondemos que está viva
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          message: "Gemini function is alive. Send POST with { prompt }."
        })
      };
    }

    // 2) Leemos el body del POST
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY in environment" })
      };
    }

    // Si no mandaron prompt desde el front, ponemos uno por defecto
    const finalPrompt =
      prompt ||
      "Crea una cena keto sencilla de 500-650 kcal. Dame: Título, Ingredientes y Preparación. Responde en español.";

    // Llamada a Gemini
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
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

    // devolvemos tal cual a tu frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Gemini function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Error calling Gemini API" })
    };
  }
};
