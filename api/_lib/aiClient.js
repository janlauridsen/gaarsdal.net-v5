import OpenAI from "openai";

const client = new OpenAI();

export async function callAI({ system, user, temperature, max_tokens }) {
  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature,
    max_tokens
  });

  return res.choices[0].message.content.trim();
}
