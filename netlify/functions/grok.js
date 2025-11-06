// netlify/functions/grok.js

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" })
    };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const APP_USER = process.env.APP_USER || ""; // opcional
  const APP_PASS = process.env.APP_PASS || ""; // opcional

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Invalid JSON" })
    };
  }

  const { prompt, mode = "dinner", lang = "es", user = "", pass = "", prefs = {}, kcal = 1600, dayIndex = 1, username = "" } = body;

  // auth simple
  if (APP_USER && APP_PASS) {
    if (user !== APP_USER || pass !== APP_PASS) {
      return {
        statusCode: 401,
        body: JSON.stringify({ ok: false, error: "Unauthorized" })
      };
    }
  }

  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "OPENAI_API_KEY not configured" })
    };
  }

  // construimos el mensaje según modo
  let messages = [];
  if (mode === "full-day") {
    const like = prefs.like || "";
    const dislike = prefs.dislike || "";
    if (lang === "en") {
      messages = [
        {
          role: "system",
          content: "You are a nutrition and training assistant. You answer ONLY in JSON and never with explanations."
        },
        {
          role: "user",
          content: `Create a FULL KETO DAY plan for day ${dayIndex} for user ${username || "User"} with about ${kcal} kcal. Consider likes: ${like}. Avoid: ${dislike}. Add 5 meals: breakfast, snackAM, lunch, snackPM, dinner. Each meal must have 'nombre' and 'qty' fields. Add macros text field (carbs, protein, fat) for the day. Also add a 'workoutToday' field with a short description and a 'weeklyFocus' field. Respond ONLY with compact JSON like:
{
  "kcal": 1600,
  "macros": {"carbs":"7%", "prot":"25%", "fat":"68%"},
  "desayuno": {"nombre":"...", "qty":"..."},
  "snackAM": {"nombre":"...", "qty":"..."},
  "almuerzo": {"nombre":"...", "qty":"..."},
  "snackPM": {"nombre":"...", "qty":"..."},
  "cena": {"nombre":"...", "qty":"..."},
  "workoutToday": "...",
  "weeklyFocus": "..."
}
Do not wrap code, do not explain.`
        }
      ];
    } else {
      messages = [
        {
          role: "system",
          content: "Eres un asistente de nutrición y entrenamiento. Respondes SOLO en JSON sin explicaciones."
        },
        {
          role: "user",
          content: `Crea un plan KETO COMPLETO para el día ${dayIndex} para el usuario ${username || "Usuario"} de unas ${kcal} kcal. Considera que le gusta: ${like}. Evita: ${dislike}. Incluye 5 comidas: desayuno, snackAM, almuerzo, snackPM y cena. Cada una con campos 'nombre' y 'qty'. Agrega un campo 'macros' con texto (carbs, prot, fat). Agrega también 'workoutToday' con el entrenamiento del día y 'weeklyFocus' con el foco de la semana. Responde SOLO con JSON compacto así:
{
  "kcal": 1600,
  "macros": {"carbs":"7%", "prot":"25%", "fat":"68%"},
  "desayuno": {"nombre":"...", "qty":"..."},
  "snackAM": {"nombre":"...", "qty":"..."},
  "almuerzo": {"nombre":"...", "qty":"..."},
  "snackPM": {"nombre":"...", "qty":"..."},
  "cena": {"nombre":"...", "qty":"..."},
  "workoutToday": "...",
  "weeklyFocus": "..."
}
No expliques nada.`
        }
      ];
    }
  } else {
    // modo cena (compat)
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "prompt required" })
      };
    }
    messages = [
      {
        role: "system",
        content: "You are a helpful keto assistant."
      },
      {
        role: "user",
        content: prompt
      }
    ];
  }

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.45,
        max_tokens: 650
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ ok: false, error: data.error?.message || "OpenAI error" })
      };
    }

    const text = data.choices?.[0]?.message?.content || "";
    let structured = null;
    if (mode === "full-day") {
      try {
        structured = JSON.parse(text);
      } catch (e) {
        // si no se pudo, igual devolvemos text
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        text,
        structured
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: e.message || "request failed" })
    };
  }
};
