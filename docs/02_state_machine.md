# State Machine

Systemet består af diskrete tilstande (states), som styrer:
- om AI kaldes
- hvilken prompt der bruges
- svarenes længde og tæthed
- stop- og afslutningslogik

States:
- G: Adfærds-/sikkerheds-state (tværgående)
- 0: Åben indgang
- 1: Meta / rolleafklaring
- 2: Praktisk / administrativ (ingen AI)
- 3: Faglig afklaring (bred)
- 4: Hypnose generelt
- 5: Evidens / risiko
- 6: Tema-afklaring
- 7: Snævert tema (fx flyskræk)
- 8: Gentagelse / terminal
- 9: Andet / uden for scope

State afgør prompt.
Prompt afgør output.
AI afgør intet selv.
