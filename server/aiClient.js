import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function callAI(state, userInput) {
  const prompt = loadPrompt(state.prompt_id);

  if (!prompt || typeof prompt !== "string") {
    throw new Error(`Prompt not found: ${state.prompt_id}`);
  }

  const messages = [
    { role: "system", content: prompt },
    { role: "user", content: userInput }
  ];

  // call OpenAI ...
}

  return {
    text: res.choices[0].message.content,
    meta: {
      model: "gpt-4.1-mini",
      temperature: prompt.temperature,
      max_tokens: prompt.max_tokens,
      prompt_id: prompt.id
    }
  };
}

