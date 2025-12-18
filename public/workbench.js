let counter = 0;

const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const responseList = document.getElementById("responseList");

sendBtn.addEventListener("click", handleSend);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;

  counter++;

  // MOCK RESPONSE — erstattes senere af backend
  const response = mockEvaluate(text);

  renderResponse(counter, response);
}

/* ---------- Rendering ---------- */

function renderResponse(index, data) {
  const article = document.createElement("article");
  article.className = "p-6 bg-white rounded shadow-sm animate-fadeIn";
  article.style.border = "1px solid #E2E0D8";

  article.innerHTML = `
    <div class="mb-4">
      <strong>Svar #${index}</strong>
    </div>

    <div class="mb-4">
      ${data.output}
    </div>

    <details class="mt-4">
      <summary class="cursor-pointer text-sm font-medium">
        Diagnostik
        <span
          class="ml-2 inline-block w-2 h-2 rounded-full"
          style="background:${data.analysis.status === "ok" ? "#2E7D32" : "#C62828"}"
        ></span>
      </summary>

      <div class="mt-4 text-sm space-y-2">
        <div><strong>State:</strong> ${data.state.id} — ${data.state.label}</div>
        <div><strong>Trigger:</strong> ${data.trigger}</div>

        <div class="pt-2">
          <strong>AI</strong><br />
          Called: ${data.ai.called}<br />
          Model: ${data.ai.model}<br />
          Temperature: ${data.ai.temperature}<br />
          Prompt ID: ${data.ai.prompt_id}
        </div>

        <div class="pt-2">
          <strong>Post-analysis</strong><br />
          Status: ${data.analysis.status.toUpperCase()}<br />
          Anomalies: ${data.analysis.anomalies.length
            ? data.analysis.anomalies.join(", ")
            : "[]"}
        </div>
      </div>
    </details>
  `;

  responseList.appendChild(article);
}

/* ---------- Mock backend ---------- */

function mockEvaluate(input) {
  // Meget grov simulering – kun til UI-test
  if (input.toLowerCase().includes("book")) {
    return {
      output: "Du kan booke en tid via kontaktformularen på hjemmesiden.",
      state: { id: 2, label: "Praktisk / administrativ" },
      trigger: "praktisk",
      ai: { called: false, model: "-", temperature: "-", prompt_id: "-" },
      analysis: { status: "ok", anomalies: [] }
    };
  }

  if (input.toLowerCase().includes("fly")) {
    return {
      output:
        "Flyskræk kan fagligt forstås som en situationsbestemt angstreaktion. Hypnoterapi anvendes i nogle sammenhænge som en metode til afklaring.",
      state: { id: 7, label: "Snævert tema (flyskræk)" },
      trigger: "tema-afklaring",
      ai: {
        called: true,
        model: "gpt-4.1-mini",
        temperature: 0,
        prompt_id: "state_7_v1"
      },
      analysis: { status: "ok", anomalies: [] }
    };
  }

  return {
    output:
      "Hypnose kan fagligt beskrives som en metode, der arbejder med opmærksomhed, forestilling og suggestion.",
    state: { id: 4, label: "Hypnose generelt" },
    trigger: "faglig",
    ai: {
      called: true,
      model: "gpt-4.1-mini",
      temperature: 0,
      prompt_id: "state_4_v1"
    },
    analysis: { status: "ok", anomalies: [] }
  };
}
