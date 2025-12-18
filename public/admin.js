const list = document.getElementById("sessionList");
const detail = document.getElementById("sessionDetail");
const warn = document.getElementById("filterWarn");
const error = document.getElementById("filterError");

warn.onchange = load;
error.onchange = load;

load();

async function load() {
  const res = await fetch("/api/admin/sessions");
  let data = await res.json();

  if (warn.checked) data = data.filter(s => s.hasWarn);
  if (error.checked) data = data.filter(s => s.hasError);

  list.innerHTML = "";
  data.forEach(s => {
    const d = document.createElement("div");
    d.className = "p-4 bg-white rounded cursor-pointer";
    d.innerText = `${s.id} · ${s.entries} entries`;
    d.onclick = () => loadDetail(s.id);
    list.appendChild(d);
  });
}

async function loadDetail(id) {
  const res = await fetch(`/api/admin/sessions/${id}`);
  const s = await res.json();

  detail.innerHTML = `
    <h2>${s.id}</h2>
    ${s.log.map(e => `
      <article>
        <b>Input:</b> ${e.input}<br>
        <b>Status:</b> ${e.response.analysis.status}<br>
        <b>State:</b> ${e.response.state.id}<br>
        <b>Output:</b> ${e.response.output}
      </article>
    `).join("")}
  `;
}
