import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callAI(prompt) {
  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ]
  });

  return {
    text: res.choices[0].message.content,
    meta: {
      called: true,
      model: "gpt-4.1-mini",
      temperature: 0,
      prompt_id: prompt.id
    }
  };
}
