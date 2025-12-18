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
  const el = document.createElement("article");
  el.className = "p-6 bg-white rounded";
  el.innerHTML = `
    <strong>Svar #${i}</strong>
    <p>${d.output}</p>
    <details>
      <summary>Diagnostik</summary>
      <div>
        State: ${d.state.id} – ${d.state.label}<br>
        Trigger: ${d.trigger}<br>
        AI: ${d.ai.called ? d.ai.model : "no"}
      </div>
    </details>
  `;
  list.appendChild(el);
}
