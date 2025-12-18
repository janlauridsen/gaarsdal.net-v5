const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const responses = document.getElementById("responses");

sendBtn.onclick = send;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
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
    body: JSON.stringify({ input: value })
  });

  const entry = await res.json();
  render(entry);

  input.value = "";
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
      <div>Status: <span class="${statusClass}">
        ${entry.analysis.status.toUpperCase()}
      </span></div>
    </div>

    ${renderLint(entry.analysis.matches)}

    <details>
      <summary>Raw log</summary>
      <pre>${JSON.stringify(entry, null, 2)}</pre>
    </details>
  `;

  // 🔹 NYESTE SVAR ØVERST
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
