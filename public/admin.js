const listEl = document.getElementById("sessionList");
const detailEl = document.getElementById("sessionDetail");
const warnBox = document.getElementById("filterWarn");
const errorBox = document.getElementById("filterError");

warnBox.onchange = load;
errorBox.onchange = load;

load();

async function load() {
  const res = await fetch("/api/admin/sessions");
  let sessions = await res.json();

  if (warnBox.checked) {
    sessions = sessions.filter(s => s.hasWarn);
  }
  if (errorBox.checked) {
    sessions = sessions.filter(s => s.hasError);
  }

  listEl.innerHTML = "";
  sessions.forEach(s => {
    const d = document.createElement("div");
    d.className = "p-4 bg-white rounded cursor-pointer";
    d.innerHTML = `
      <b>${s.id}</b><br>
      Entries: ${s.entries}<br>
      ${s.hasWarn ? "⚠️ WARN " : ""}
      ${s.hasError ? "⛔ ERROR" : ""}
    `;
    d.onclick = () => loadDetail(s.id);
    listEl.appendChild(d);
  });
}

async function loadDetail(id) {
  const res = await fetch(`/api/admin/sessions/${id}`);
  const s = await res.json();

  detailEl.innerHTML = `
    <h2 class="text-base-lg mt-8 mb-4">Session ${s.id}</h2>
    ${s.log.map(e => `
      <article class="mb-4">
        <b>Input:</b> ${e.input}<br>
        <b>Status:</b> ${e.response.analysis.status}<br>
        <b>State:</b> ${e.response.state.id}<br>
        <b>Output:</b> ${e.response.output}
      </article>
    `).join("")}
  `;
}
