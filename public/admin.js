import { renderResponse } from "./ui/renderResponse.js";

const sessionSelect = document.getElementById("sessionSelect");
const responses = document.getElementById("responses");

loadSessions();

sessionSelect.onchange = loadSession;

async function loadSessions() {
  const res = await fetch("/api/admin/sessions");
  const sessions = await res.json();

  sessions.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.session_id;
    opt.textContent = `${s.session_id} (${s.count} inputs)`;
    sessionSelect.appendChild(opt);
  });
}

async function loadSession() {
  const id = sessionSelect.value;
  if (!id) return;

  responses.innerHTML = "";

  const res = await fetch(`/api/admin/session/${id}`);
  const entries = await res.json();

  entries
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(entry => {
      responses.appendChild(
        renderResponse(entry, { collapsed: false })
      );
    });
}
