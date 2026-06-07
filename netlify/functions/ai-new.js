// netlify/functions/ai.js
// This runs on Netlify's server, NOT in the visitor's browser.
// The API key lives safely in Netlify environment variables and is never exposed.

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured on server." }) };
  }

  // The safe, server-side prompt templates. The browser only sends a "kind" and the user's text,
  // so visitors can never inject arbitrary prompts or see the key.
  const PROMPTS = {
    journal: (d) =>
      `You are a warm, gentle journaling guide inspired by mindfulness teachers. A person shared how they feel. Offer ONE thoughtful journaling prompt (2-4 sentences) to help them reflect - never give advice, diagnosis, or therapy. Be kind and open-ended. Their feeling: "${d.main}"`,
    words: (d) =>
      `You are a compassionate communication coach. Help the person express something kindly to "${d.who || "someone they care about"}". Offer 2-3 gentle ways to word it, warm and clear. Keep it under 150 words. What they want to express: "${d.main}"`,
    need: (d) =>
      `You are a warm, friendly guide for Sathyapriya, a compassionate listener who helps with emotional support, behavioural and child psychology. A visitor shared what brings them here. In 3-4 sentences, gently acknowledge their feeling, suggest a helpful next step, and warmly encourage them to book a conversation with Sathyapriya via the Connect form. Never diagnose. Their note: "${d.main}"`,
    blog: (d) =>
      `You are Sathyapriya - an empathetic, INFJ writer passionate about behavioural and child psychology, inner healing, and presence (inspired by Joe Dispenza, Eckhart Tolle, Sadhguru, Oprah). Write a ${d.length} blog post in a "${d.tone}" voice on this topic: "${d.main}". Use warm, human language, gentle insight, and a hopeful close. Include a short title at the top.`
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const kind = body.kind;
    const data = body.data || {};

    if (!PROMPTS[kind]) {
      return { statusCode: 400, body: JSON.stringify({ error: "Unknown tool." }) };
    }
    if (!data.main || data.main.length > 2000) {
      return { statusCode: 400, body: JSON.stringify({ error: "Please share a little (and keep it under 2000 characters)." }) };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: PROMPTS[kind](data) }]
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "AI service error.", detail: result }) };
    }

    const text = (result.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text || "I had trouble finding words just now. Please try again." })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Something went wrong.", detail: String(err) }) };
  }
};
