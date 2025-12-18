let seq = 0;

const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");
const list = document.getElementById("responseList");

let sessionId = null;

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
  const el = document.createElement("article");
  el.className = "p-6 bg-white rounded animate-fadeIn";
  el.innerHTML = `
    <strong>Svar #${i}</strong>
    <p class="mt-4">${d.output}</p>
    <details class="mt-4">
      <summary>Diagnostik</summary>
      <div class="text-sm mt-4">
        <div><b>State:</b> ${d.state.id} – ${d.state.label}</div>
        <div><b>Trigger:</b> ${d.trigger}</div>
        <div><b>AI:</b> ${d.ai.called ? d.ai.model : "no"}</div>
      </div>
    </details>
  `;
  list.appendChild(el);
}
