const sessions = [
  { id: "sess-1", ip: "1.2.3.4", inputs: 4 },
  { id: "sess-2", ip: "5.6.7.8", inputs: 2 }
];

const root = document.getElementById("sessions");
sessions.forEach(s => {
  const d = document.createElement("div");
  d.className = "p-4 mb-4 bg-white rounded";
  d.textContent = `Session ${s.id} · IP ${s.ip} · Inputs ${s.inputs}`;
  root.appendChild(d);
});

