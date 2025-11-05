// netlify/functions/gemini.js

// usamos el modelo que tu cuenta SÍ tiene
// si algún día te habilitan gemini-1.5-flash, solo cambias este nombre
const DEFAULT_MODEL = "models/text-bison-001";

exports.handler = async (event) => {
  // solo aceptamos POST desde tu frontend
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: true,
        message: "Gemini function is alive. Send POST with { prompt }.",
      }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY not set in Netlify" }),
      };
    }

    // endpoint viejo (v1beta) pero que tu cuenta sí tiene
    const url = `https://generativelanguage.googleapis.com/v1beta/${DEFAULT_MODEL}:generateText?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: prompt,
        },
        // para que responda corto
        temperature: 0.8,
        maxOutputTokens: 256,
      }),
    });

    const data = await res.json();

    // si la API devolvió error, lo mandamos tal cual al front
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({
          error: data.error?.message || "Error from Google API",
        }),
      };
    }

    // text-bison responde así:
    // { candidates: [ { output: "..." } ] }
    const text =
      data.candidates && data.candidates[0] && data.candidates[0].output
        ? data.candidates[0].output
        : "";

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        text,
      }),
    };
  } catch (err) {
    console.error("Gemini function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error calling Gemini" }),
    };
  }
};
