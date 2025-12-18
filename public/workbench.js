let seq = 0;
let sessionId = null;

const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");
const list = document.getElementById("responseList");

const stateValue = document.getElementById("stateValue");
const stateTrigger = document.getElementById("stateTrigger");

btn.onclick = send;
input.onkeydown = e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
};

async function send() {
  const text = input.value.trim();
  if (!text) return;

  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: text, session_id: sessionId })
  });

  const data = await res.json();
  sessionId = data.session_id;

  updateActiveState(data);
  render(++seq, data);
}

function updateActiveState(d) {
  stateValue.textContent = `${d.state.id} – ${d.state.label}`;
  stateTrigger.textContent = d.trigger ? `(${d.trigger})` : "";
}

function render(i, d) {
  const cls =
    d.analysis.status === "ok"
      ? "status-ok"
      : d.analysis.status === "warn"
      ? "status-warn"
      : "status-error";

  const el = document.createElement("article");
  el.innerHTML = `
    <div class="flex justify-between items-center">
      <strong>Svar #${i}</strong>
      <span class="status-dot ${cls}"></span>
    </div>

    <p class="mt-2">${d.output}</p>

    <details class="mt-3">
      <summary>Diagnostik</summary>
      <div class="mt-2 text-sm">
        State: ${d.state.id} – ${d.state.label}<br>
        Trigger: ${d.trigger}<br>
        Status: ${d.analysis.status}<br>
        Anomalies: ${JSON.stringify(d.analysis.anomalies)}
      </div>
    </details>
  `;
  list.appendChild(el);
}
