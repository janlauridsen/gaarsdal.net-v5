export function renderResponse(entry, { collapsed = false } = {}) {
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
          <span class="state-badge state-${entry.state.id}">
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

  return el;
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
