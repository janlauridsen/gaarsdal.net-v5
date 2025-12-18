document.getElementById("loadBtn").onclick = async () => {
  const res = await fetch("/api/admin/sessions", {
    headers: {
      Authorization: `Bearer ${prompt("Admin token")}`
    }
  });

  document.getElementById("out").textContent =
    res.ok ? JSON.stringify(await res.json(), null, 2) : "Access denied";
};
