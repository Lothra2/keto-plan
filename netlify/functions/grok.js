// netlify/functions/grok.js
// Esta función recibe { prompt: "..." } desde el front
// llama a xAI (Grok) y devuelve siempre { ok: true, text: "..." }
// para que tu script del navegador no muestre "IA no respondió".

const API_URL = "https://api.x.ai/v1/chat/completions"; // endpoint estilo OpenAI

exports.handler = async (event, context) => {
  // solo aceptamos POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userPrompt =
      body.prompt || "Dame 1 cena keto simple con ingredientes y preparación.";

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: "XAI_API_KEY no está definida en las variables de entorno."
        })
      };
    }

    // llamada a xAI
    const xaiRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-2-latest",      // cámbialo por el modelo que veas en tu panel
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que responde corto y claro. Si te piden una receta keto responde solo la receta."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 400,
        temperature: 0.4
      })
    });

    // si la API de xAI falló (403, 404, 500...)
    if (!xaiRes.ok) {
      const errText = await xaiRes.text();
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: "Error desde xAI: " + errText
        })
      };
    }

    const data = await xaiRes.json();

    // intentamos sacar el texto de las estructuras típicas
    let finalText = "";
    if (Array.isArray(data.choices) && data.choices.length > 0) {
      // formato tipo OpenAI
      finalText = data.choices[0].message?.content || "";
    } else if (data.output_text) {
      // formato tipo /v1/responses
      finalText = data.output_text;
    }

    if (!finalText) {
      finalText = "No pude generar la respuesta de la cena.";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        text: finalText,
        raw: data // por si quieres ver en consola qué devuelve
      })
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: false,
        error: "Excepción en la función: " + err.message
      })
    };
  }
};
