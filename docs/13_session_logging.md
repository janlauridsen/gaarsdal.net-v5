# Session Logging – Version 1

Systemet logger interaktioner for:
- fejlfinding
- design-validering
- sikkerhed

Logning er anonym og ikke-profilerende.
Session-model

## Session

En session oprettes ved første input.

Session indeholder:
- session_id (UUID)
- created_at
- last_activity_at
- ip_address
- evt. geo (afledt)

Session TTL:
- konfigurerbar
- typisk 7–30 dage
- fornyes ved aktivitet
Log entry (per input)

## Log Entry

Hver brugerinteraktion logger:
- session_id
- timestamp
- raw input
- resolved state
- state transition
- AI prompt metadata
- endeligt AI-output
- post-analysis resultat
- flags (terminal, G, vulnerability)
- anomaly codes (array)

Designprincipper

- Ingen persondata
- Ingen brugerprofiler
- IP anvendes kun til sikkerhed og geo
- Samme datastruktur som Test Workbench

Sessioner i V1 er in-memory og eksisterer kun
så længe den serverless instans er aktiv.

Ved cold start eller redeploy nulstilles:
- sessions
- logs

Dette er forventet og accepteret adfærd i V1.
