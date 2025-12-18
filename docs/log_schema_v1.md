# Log Schema v1

Dette dokument definerer den kanoniske log-entry-struktur
for gaarsdal.net-v5.

Samme struktur anvendes til:
- live-visning i Test Workbench
- senere persistens (database / filer)
- Admin UI

### ai

ai.temperature og ai.max_tokens er obligatoriske,
når ai.called = true.

De afspejler state-specifikke systembeslutninger
og må ikke ændres dynamisk.

### session.geo

Geo-data leveres af Vercel og er:
- ikke præcis
- ikke brugerprofilerende
- kun til analyse og sikkerhed

Felter:
- country (ISO-2)
- region
- city

Hvis data ikke findes, sættes felter til null.

Workbench = direkte rendering af én log-entry.

---

## LogEntry (V1)

```json
{
  "timestamp": 1710000000000,

  "session": {
    "session_id": "uuid",
    "ip": "xxx.xxx.xxx.xxx",
    "geo": {
      "country": "DK",
      "region": "Hovedstaden",
      "city": "København"
    }
  },

  "input": {
    "raw": "brugerens inputtekst"
  },

  "state": {
    "id": "4",
    "label": "Hypnose generelt"
  },

  "transition": {
    "type": "enter | continue | interrupt | reset",
    "trigger": "faglig | praktisk | gentagelse | G | andet"
  },

  "ai": {
    "called": true,
    "bypass_reason": "practical | guard | terminal | none",
    "prompt_id": "state_4_v1",
    "model": "gpt-4.1-mini",
    "error": null
  },

  "output": {
    "text": "AI- eller systemoutput",
    "terminal": false
  },

  "analysis": {
    "status": "ok | warn | error",
    "anomalies": [
      "QUESTION_FOUND",
      "RELATIONAL_TONE"
    ]
  }
}
