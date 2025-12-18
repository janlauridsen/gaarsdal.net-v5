let seq = 0;
let sessionId = null;

const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");
const list = document.getElementById("responseList");

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
  render(++seq, data);
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
    <p>${d.output}</p>
    <details>
      <summary>Diagnostik</summary>
      <div>
        State: ${d.state.id} – ${d.state.label}<br>
        Trigger: ${d.trigger}<br>
        Status: ${d.analysis.status}<br>
        Anomalies: ${JSON.stringify(d.analysis.anomalies)}
      </div>
    </details>
  `;
  list.appendChild(el);
}
