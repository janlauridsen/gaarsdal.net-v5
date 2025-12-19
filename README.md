# gaarsdal.net-v5

## Status (V1)

Dette repository indeholder en fungerende V1-implementering
af et AI-baseret fagligt afklaringssystem.

Systemet kører som Vercel serverless functions.
State, sessioner og logs er in-memory og nulstilles ved redeploy
eller cold start.

Formålet med V1 er:
- design-validering
- test af state machine
- observation via Test Workbench og Admin UI

Systemet er ikke beregnet til produktion uden persistence.


AI-baseret fagligt afklaringssystem med eksplicit state- og aktionstyring.

Dette repository indeholder **design, adfærds-specifikation og test-artefakter**
for et system, der anvender AI som et kontrolleret tekstmodul – ikke som chatbot,
rådgiver eller terapeut.

Systemet er designet med fokus på:
- faglig afklaring
- etisk robusthed
- forudsigelig adfærd
- observabilitet og testbarhed

Der er **ingen slutbruger-løsning** i denne version.

---

## Where to start

Hvis du er ny i repoet, anbefales denne rækkefølge:

- **Concept & intent**  
  `docs/01_system_overview.md`

- **Behaviour & logic**  
  `docs/02_state_machine.md`

- **Ethics & tone**  
  `docs/03_tone_and_ethics_contract.md`

- **Safety & abuse handling**  
  `docs/04_guard_state_G.md`

- **Testing & validation**  
  `docs/06_test_questions.md`  
  `docs/08_state_sequence_tests.md`

---

## Project phases

### Phase 1: Design & Behaviour Specification (completed)

Denne fase fastlægger systemets fulde adfærdsmæssige og etiske grundlag.

Indeholder:
- State machine og overgangslogik
- Tone- og etikkontrakt
- Håndtering af sårbarhed og grænseoverskridelser
- Worst-case UX-analyse
- Testkataloger (enkelt-input og sekvensbaseret)
- Design for observabilitet (logging, diagnoser)

Resultat:
- Et fuldt specificeret systemdesign
- Ingen teknologiske bindinger
- Klar baseline for implementering

---

### Phase 2: Instrumented Prototype (next)

Næste fase fokuserer på **validering af systemadfærd gennem instrumentering** –
ikke på at bygge et færdigt produkt.

Planlagt scope:
- **Test Workbench**  
  Intern side til simulering af input og visning af:
  - endeligt output
  - resolved state
  - prompt-parametre
  - post-analysis status og anomalier

- **Session logging**  
  Anonym, session-baseret logning til:
  - fejlfinding
  - designvalidering
  - sikkerhed

- **Admin UI**  
  Beskyttet, read-only interface til:
  - gennemsyn af sessioner
  - analyse af systemets faktiske adfærd over tid

Bevidste fravalg i Phase 2:
- Ingen slutbruger-UX
- Ingen personalisering
- Ingen analytics eller optimering
- Ingen forretningslogik

---

## Design principles (kort)

- AI er stateless pr. kald
- UI + server fungerer som state machine
- State bestemmer prompt og svaradfærd
- Tone styres af state – aldrig af brugerens følelser
- Systemet er altid klar til at blive afbrudt
- Observabilitet er en del af designet, ikke en eftertanke

---

## Repository status

Dette repo kan:
- bruges som single source of truth for systemadfærd
- ligge stabilt, mens implementering udvikles separat
- danne grundlag for QA, audit og videre iteration

Ændringer i implementering bør **altid** vurderes op imod
de dokumenterede design-kontrakter i `/docs`.

---

## License

Se `LICENSE`.
