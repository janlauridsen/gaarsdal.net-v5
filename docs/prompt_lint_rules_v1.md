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
A2. Direkte invitation
regex
Kopier kode
\b(du kan|du må|du bør|spørg|fortæl|lad mig|hvis du vil)\b
A3. Opfølgning / fortsættelse
regex
Kopier kode
\b(hvad tænker du|vil du|ønsker du|har du lyst)\b
Severity: ERROR

B. Relationel tone (ALDRIG tilladt)
B1. Empati / spejling
regex
Kopier kode
\b(jeg forstår|det lyder|det giver mening|jeg er ked af)\b
B2. Personlig tiltale (blød)
regex
Kopier kode
\b(for dig|hos dig|din situation|i dit tilfælde)\b
Severity: ERROR

C. Rådgivning & vurdering (ALDRIG tilladt)
C1. Råd / anbefaling
regex
Kopier kode
\b(du bør|jeg anbefaler|det anbefales|det er bedst at)\b
C2. Vurdering af effekt for individ
regex
Kopier kode
\b(vil hjælpe|virker for|har effekt for|god løsning)\b
Severity: ERROR

D. Modalverber (KONTROLLERET)
Tilladt kun hvis efterfulgt af begrænsning.

D1. Modalverber (detektion)
regex
Kopier kode
\b(kan|ofte|typisk|muligvis|nogle gange)\b
Severity: WARN
Manuel vurdering: Skal ledsages af begrænsning
(fx “kan … men evidensen er begrænset”).

E. Kvantificering (STATE-AFHÆNGIG)
Altid forbudt i state 7 og 8.

E1. Tal / intervaller
regex
Kopier kode
\b\d+(\s*[-–]\s*\d+)?\b
E2. Tidsangivelser
regex
Kopier kode
\b(uger|måneder|sessioner|gange|forløb)\b
Severity: ERROR (i state 7 / 8)
Severity: WARN (andre states)

F. Evidensglidning (STATE-AFHÆNGIG)
Kun tilladt i state 5.

F1. Evidensord
regex
Kopier kode
\b(studier|forskning|evidens|meta-analyse|randomiseret)\b
Severity: ERROR (uden for state 5)

G. Terminalbrud
G1. Overlængde
regex
Kopier kode
(.|\n){400,}
Severity: WARN / ERROR afhængigt af state
(brug max_tokens som reference)

Outputformat (anbefalet)
json
Kopier kode
{
  "status": "ok | warn | error",
  "matches": [
    {
      "rule": "A1",
      "pattern": "\\?",
      "excerpt": "…"
    }
  ]
}
Designprincipper
Lint-regler ændres sjældent

Prompts justeres ofte

WARN bruges til design-feedback

ERROR bruges til kontraktbrud

