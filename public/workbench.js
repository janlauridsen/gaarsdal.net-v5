let sessionId = null;

const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");
const list = document.getElementById("responseList");
const stateBox = document.getElementById("activeState");
const errorBanner = document.getElementById("errorBanner");

btn.onclick = send;

async function send() {
  errorBanner.classList.add("hidden");

  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: input.value, session_id: sessionId })
    });

    if (!res.ok) throw new Error();

    const entry = await res.json();
    sessionId = entry.session.session_id;

    stateBox.textContent =
      `State: ${entry.state.id} – ${entry.state.label}`;

    render(entry);
  } catch {
    errorBanner.classList.remove("hidden");
  }
}

function render(e) {
  const el = document.createElement("article");
  el.innerHTML = `
    <p>${e.output.text}</p>

    <details>
      <summary>Log entry</summary>
      <pre>${JSON.stringify(e, null, 2)}</pre>
    </details>
  `;
  list.appendChild(el);
}
