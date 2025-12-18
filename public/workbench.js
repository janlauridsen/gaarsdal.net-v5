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

    const data = await res.json();
    sessionId = data.session_id;

    stateBox.textContent = `State: ${data.state.id} – ${data.state.label}`;
    render(data);
  } catch {
    errorBanner.classList.remove("hidden");
  }
}

function render(d) {
  const el = document.createElement("article");
  el.innerHTML = `
    <p>${d.output}</p>
    <small>${d.analysis.status.toUpperCase()}</small>
  `;
  list.appendChild(el);
}
