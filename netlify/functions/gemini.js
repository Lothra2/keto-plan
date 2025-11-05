// netlify/functions/gemini.js

// Esta versión usa el modelo viejo de la API: text-bison-001
// y luego transforma la respuesta al formato que espera tu frontend
// (candidates[0].content.parts[0].text)

exports.handler = async (event, context) => {
  try {
    // 1) GET de prueba desde el navegador
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          message:
            "Function alive. Send POST with { prompt }. Using text-bison-001."
        })
      };
    }

    // 2) POST con prompt
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

    // 👇 Aquí el endpoint de la API vieja
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: finalPrompt
          },
          temperature: 0.9,
          maxOutputTokens: 512
        })
      }
    );

    const data = await resp.json();

    // Si la API vieja respondió con error, lo mandamos al front
    if (data.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text:
                      "La API respondió con un error: " +
                      (data.error.message || "desconocido")
                  }
                ]
              }
            }
          ]
        })
      };
    }

    // La API vieja suele devolver data.candidates[0].output
    const textFromPalm =
      data.candidates &&
      data.candidates[0] &&
      (data.candidates[0].output || data.candidates[0].content)
        ? data.candidates[0].output || data.candidates[0].content
        : "";

    // Devolvemos en FORMATO GEMINI para que tu frontend no cambie
    return {
      statusCode: 200,
      body: JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text:
                    textFromPalm ||
                    "No obtuve texto de la API (text-bison-001). Prueba con otro prompt."
                }
              ]
            }
          }
        ]
      })
    };
  } catch (err) {
    console.error("Gemini/Palm function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Error calling text-bison-001"
      })
    };
  }
};
