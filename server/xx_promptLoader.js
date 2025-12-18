import fs from "fs";
import path from "path";

const base = path.resolve("server/prompts");

export function loadPrompt(prompt_id) {
  const file = path.join(base, `${prompt_id}.md`);
  return fs.readFileSync(file, "utf8");
}
