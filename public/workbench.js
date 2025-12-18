let seq = 0;

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

function send() {
  const text = input.value.trim();
  if (!text) return;
  seq++;
  const res = apiMock(text);
  render(seq, res);
}

function render(i, d) {
  const el = document.createElement("article");
  el.className = "p-6 bg-white rounded animate-fadeIn";
  el.style.border = "1px solid #E2E0D8";

  el.innerHTML = `
    <strong>Svar #${i}</strong>
    <p class="mt-4">${d.output}</p>

    <details class="mt-4">
      <summary>Diagnostik
        <span style="display:inline-block;width:8px;height:8px;
        background:${d.analysis.status==="ok"?"#2E7D32":"#C62828"};
        border-radius:50%;margin-left:6px"></span>
      </summary>

      <div class="text-sm mt-4">
        <div><b>State:</b> ${d.state.id} – ${d.state.label}</div>
        <div><b>Trigger:</b> ${d.trigger}</div>
        <div class="mt-2"><b>AI:</b>
          called=${d.ai.called},
          model=${d.ai.model},
          temp=${d.ai.temperature},
          prompt=${d.ai.prompt_id}
        </div>
        <div class="mt-2"><b>Analysis:</b>
          ${d.analysis.status},
          anomalies=${JSON.stringify(d.analysis.anomalies)}
        </div>
      </div>
    </details>
  `;
  list.appendChild(el);
}
