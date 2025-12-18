const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const resetBtn = document.getElementById("reset");
const toggleBtn = document.getElementById("toggleCollapse");
const responses = document.getElementById("responses");

let sessionId = null;
let collapsed = true;
let stateFilter = null;

sendBtn.onclick = send;
resetBtn.onclick = resetSession;
toggleBtn.onclick = toggleCollapse;

input.focus();

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
    body: JSON.stringify({ input: value, session_id: sessionId })
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
  stateFilter = null;
  input.focus();
}

function toggleCollapse() {
  collapsed = !collapsed;
  toggleBtn.textContent = collapsed ? "Vis alle" : "Skjul ikke-terminale";
  document
    .querySelectorAll("article")
    .forEach(el => el.classList.toggle("collapsed", collapsed && !el.classList.contains("terminal")));
}

function setStateFilter(stateId) {
  stateFilter = stateFilter === stateId ? null : stateId;

  document.querySelectorAll("article").forEach(el => {
    const elState = el.dataset.state;
    el.style.display =
      !stateFilter || elState === stateFilter ? "" : "none";
  });
}

function render(entry) {
  const el = document.createElement("article");
  el.dataset.state = entry.state.id;

  if (entry.output.terminal) el.classList.add("terminal");
  if (collapsed && !entry.output.terminal) el.classList.add("collapsed");

  const statusClass =
    entry.analysis.status === "ok"
      ? "status-ok"
      : entry.analysis.status === "warn"
      ? "status-warn"
      : "status-error";

  el.innerHTML = `
    <div class="timeline-row">
      <div class="time">
        ${new Date(entry.timestamp).toLocaleTimeString()}
      </div>

      <div class="content">
        <div class="header">
          <span class="state-badge state-${entry.state.id}"
            onclick="setStateFilter('${entry.state.id}')">
            State ${entry.state.id}
          </span>
          ${entry.output.terminal ? `<span class="terminal-badge">Terminal</span>` : ""}
        </div>

        <p>${entry.output.text}</p>

        <div class="meta">
          <div>Status:
            <span class="${statusClass}">
              ${entry.analysis.status.toUpperCase()}
            </span>
          </div>
        </div>

        ${renderLint(entry.analysis.matches)}

        <details>
          <summary>Raw log</summary>
          <pre>${JSON.stringify(entry, null, 2)}</pre>
        </details>
      </div>
    </div>
  `;

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
        <thead><tr><th>Rule</th><th>Severity</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </details>
  `;
}

window.setStateFilter = setStateFilter;
