// netlify/functions/grok.js

exports.handler = async (event, context) => {
  try {
    const body = event.httpMethod === 'POST' ? JSON.parse(event.body || '{}') : {};
    const prompt = body.prompt || "Hola Grok, ¿puedes responderme?";
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" })
      };
    }

    const response = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-2", // o grok-4 si tu cuenta lo permite
        messages: [
          { role: "system", content: "You are Grok, a helpful assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
