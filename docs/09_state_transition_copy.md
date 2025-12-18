# State Transition Copy – Version 1

Dette dokument beskriver, hvordan overgange mellem states
kommunikeres sprogligt over for brugeren.

Formål:
- Reducere UX-friktion ved emneskift
- Undgå oplevelsen af “udenomssnak”
- Bevare institutions-tone uden forklaringer eller empati

Grundregel:
State-skift forklares kun, hvis fraværet af forklaring
med stor sandsynlighed vil opleves som uforståeligt.

---

## Hvornår der IKKE siges noget
Ingen overgangstekst anvendes når:
- brugeren stiller et klart fagligt spørgsmål
- brugeren skifter emne tydeligt
- systemet går fra snævert → bredere emne
- systemet går fra fagligt → praktisk

Eksempel:
Input: “Hvordan booker jeg en tid?”
→ Praktisk svar direkte

---

## Hvornår der siges ÉN linje
Én linje anvendes når:
- systemet afviser personlig støtte
- systemet kræver afklaring før svar
- systemet afslutter et flow

Eksempel:
> “Dette værktøj håndterer ikke personlige forhold, men kan give faglig information.”

---

## Forbudte overgangsformer
Systemet må aldrig:
- forklare sin interne logik
- nævne “state”, “flow” eller “ramme”
- undskylde
- invitere til dialog

---

## Designprincip
Jo tydeligere brugerens intention er,
jo mindre skal systemet forklare.
