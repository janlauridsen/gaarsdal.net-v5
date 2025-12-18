const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const resetBtn = document.getElementById("reset");
const responses = document.getElementById("responses");

let sessionId = null;

sendBtn.onclick = send;
resetBtn.onclick = resetSession;

input.focus();

input.addEventListener("keydown", (e) => {
  const isEnter = e.key === "Enter";
  const isCtrlEnter = isEnter && (e.ctrlKey || e.metaKey);

  if ((isEnter && !e.shiftKey) || isCtrlEnter) {
    e.preventDefault();
    send();
  }
});

async function send() {
  const value = input.value.trim();
  if (!value) return;

  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: value,
      session_id: sessionId
    })
  });

  const entry = await res.json();
  sessionId = entry.session.session_id;

  render(entry);

  input.value = "";
  input.focus();

  if (entry.output.terminal) {
    resetBtn.classList.remove("hidden");
  }
}

function resetSession() {
  sessionId = null;
  resetBtn.classList.add("hidden");
  input.focus();
}

function render(entry) {
  const el = document.createElement("article");

  const statusClass =
    entry.analysis.status === "ok"
      ? "status-ok"
      : entry.analysis.status === "warn"
      ? "status-warn"
      : "status-error";

  el.innerHTML = `
    <p>${entry.output.text}</p>

    <div class="meta">
      <div>State: ${entry.state.id}</div>
      <div>Status:
        <span class="${statusClass}">
          ${entry.analysis.status.toUpperCase()}
        </span>
      </div>
      <div>Terminal: ${entry.output.terminal}</div>
    </div>

    ${renderLint(entry.analysis.matches)}

    <details>
      <summary>Raw log</summary>
      <pre>${JSON.stringify(entry, null, 2)}</pre>
    </details>
  `;

  // Nyeste svar øverst
  responses.prepend(el);
}

function renderLint(matches = []) {
  if (!matches.length) {
    return `<div class="lint status-ok">Ingen lint-fejl</div>`;
  }

  const rows = matches.map(m => {
    const group = m.rule.charAt(0);
    return `
      <tr class="lint-rule-${group}">
        <td>${m.rule}</td>
        <td>${m.severity.toUpperCase()}</td>
      </tr>
    `;
  }).join("");

  const open = matches.some(m => m.severity === "error") ? "open" : "";

  return `
    <details class="lint" ${open}>
      <summary>Lint (${matches.length})</summary>
      <table>
        <thead>
          <tr><th>Rule</th><th>Severity</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </details>
  `;
}
