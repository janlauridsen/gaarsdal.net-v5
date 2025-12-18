# Test Workbench – Version 1

Test Workbench er et internt design- og testværktøj.
Det er ikke et slutbruger-interface.

Formål:
- simulere brugerinput
- vise systemets endelige output
- eksponere interne beslutninger (states, prompts)
- identificere fejl og anomalier tidligt

Workbench viser sandheden om systemet,
ikke en poleret brugeroplevelse.
Funktionel beskrivelse

## Funktioner

- Inputfelt til simulering af brugerinput
- Akkumuleret visning af svar (sekvensbaseret)
- For hvert svar vises:
  - resolved state
  - state-trigger (fx emneskift, gentagelse, G-state)
  - AI-prompt-parametre (metadata)
  - post-analysis resultat

Statusindikator:
- Grøn: svar inden for design-kontrakten
- Rød: fejl eller anomali
Designprincipper

- Workbench er read-only ift systemets logik
- Ingen skjult adfærd
- Interne labels er tilladt
- UX-prioritet er lav; transparens er høj
