const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function callClaude(systemPrompt, userContent) {

  if (!CLAUDE_API_KEY) {
    throw new Error("API key missing. Check your .env file.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: "user", content: userContent }
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Claude API call failed");
  }

  const data = await response.json();
  return data.content[0].text;
}