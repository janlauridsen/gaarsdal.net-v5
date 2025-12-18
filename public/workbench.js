let sessionId = null;

const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");
const list = document.getElementById("responseList");
const stateBox = document.getElementById("activeState");
const errorBanner = document.getElementById("errorBanner");

btn.onclick = send;

async function send() {
  errorBanner.classList.add("hidden");

  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: input.value, session_id: sessionId })
    });

    if (!res.ok) throw new Error();

    const entry = await res.json();
    sessionId = entry.session.session_id;

    stateBox.textContent =
      `State: ${entry.state.id} – ${entry.state.label}`;

    renderEntry(entry);
  } catch {
    errorBanner.classList.remove("hidden");
  }
}

function renderEntry(entry) {
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
      <div><strong>Terminal:</strong> ${entry.output.terminal}</div>
      <div><strong>Transition:</strong> ${entry.transition.type} (${entry.transition.trigger})</div>
      <div><strong>AI:</strong> ${entry.ai.called ? "CALLED" : "BYPASSED"} ${entry.ai.bypass_reason || ""}</div>
      <div><strong>Status:</strong> <span class="${statusClass}">${entry.analysis.status.toUpperCase()}</span></div>
    </div>

    ${renderMatches(entry.analysis.matches)}

    <details>
      <summary>Raw log entry</summary>
      <pre>${JSON.stringify(entry, null, 2)}</pre>
    </details>
  `;

  list.appendChild(el);
}

function renderMatches(matches = []) {
  if (!matches.length) {
    return `<div class="lint ok">Ingen lint-træffere</div>`;
  }

  const rows = matches.map(m => `
    <tr class="lint-${m.severity}">
      <td>${m.rule}</td>
      <td>${m.severity.toUpperCase()}</td>
    </tr>
  `).join("");

  return `
    <div class="lint">
      <strong>Lint matches</strong>
      <table>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
