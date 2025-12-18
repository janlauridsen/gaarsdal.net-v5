# Prompt Lint Rules v1

Dette dokument definerer mekaniske lint-regler
til kvalitetssikring af AI-output i gaarsdal.net-v5.

Formålet er at:
- opdage brud på tone- og etik-kontrakt
- opdage dialogglidning
- opdage rådgivning, relation og invitation
- gøre prompt-review reproducerbar

Reglerne er:
- regex-baserede
- deterministiske
- uafhængige af semantik
- anvendelige på AI-output (post-generation)

---

## Grundprincip

Lint er:
- en **detektor**, ikke en dommer
- binær (match / no match)
- brugt til WARN / ERROR flagging

Ingen regel må:
- forsøge at “forstå” intention
- vurdere sandhed eller kvalitet
- erstatte state-logik

---

## Regelkategorier

### A. Dialog & Invitation (ALDRIG tilladt)

Disse indikerer chatbot-adfærd.

#### A1. Spørgsmål
```regex
\?
