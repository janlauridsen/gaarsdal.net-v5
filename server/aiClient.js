import OpenAI from "openai";
import fs from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Load prompt text from /server/prompts
 */
function loadPrompt(promptId) {
  const filePath = path.join(
    process.cwd(),
    "server",
    "prompts",
    `${promptId}.md`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8");
}

export async function callAI(state, userInput) {
  const promptText = loadPrompt(state.prompt_id);

  if (!promptText || typeof promptText !== "string") {
    throw new Error(`Prompt not found or invalid: ${state.prompt_id}`);
  }

  const messages = [
    { role: "system", content: promptText },
    { role: "user", content: userInput }
  ];

  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: state.temperature ?? 0,
    max_tokens: state.max_tokens ?? 300,
    messages
  });

  return {
    text: res.choices[0].message.content,
    meta: {
      called: true,
      model: "gpt-4.1-mini",
      temperature: state.temperature ?? 0,
      max_tokens: state.max_tokens ?? 300,
      prompt_id: state.prompt_id,
      error: null
    }
  };
}
