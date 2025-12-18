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
  const statusClass =
    d.analysis.status === "ok"
      ? "status-ok"
      : d.analysis.status === "warn"
      ? "status-warn"
      : "status-error";

  const el = document.createElement("article");
  el.className = "p-6 bg-white rounded animate-fadeIn";
  el.innerHTML = `
    <div class="flex items-center justify-between">
      <strong>Svar #${i}</strong>
      <span class="status-dot ${statusClass}"></span>
    </div>

    <p class="mt-4">${d.output}</p>

    <details class="mt-4">
      <summary class="cursor-pointer text-sm font-medium">
        Diagnostik
      </summary>

      <div class="text-sm mt-4 space-y-2">
        <div><b>Status:</b> ${d.analysis.status.toUpperCase()}</div>
        <div><b>State:</b> ${d.state.id} – ${d.state.label}</div>
        <div><b>Trigger:</b> ${d.trigger}</div>

        <div class="pt-2">
          <b>AI:</b>
          ${d.ai.called ? d.ai.model : "not used"}
        </div>

        <div class="pt-2">
          <b>Anomalies:</b>
          ${
            d.analysis.anomalies.length
              ? `<ul>${d.analysis.anomalies
                  .map(a => `<li>${a}</li>`)
                  .join("")}</ul>`
              : "[]"
          }
        </div>
      </div>
    </details>
  `;
  list.appendChild(el);
}
