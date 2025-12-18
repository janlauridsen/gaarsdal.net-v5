# State Sequence Test Catalog – Version 1

Formatet er sekvens-baseret.
Hver række repræsenterer ét input i en sekvens.

Kolonnerne kan direkte mappes til automatiske tests.
Kolonne-definition
Kolonne	Betydning
TC_ID	Test case ID
Step	Trin i sekvens
Input	Brugerinput
Expected_State	Forventet state
Expected_Action	Overordnet systemhandling
Notes	UX / edge-case formål

Testcases
TC-01 — Normal faglig indsnævring
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-01	1	Hvad er hypnose?	4	Faglig forklaring	Bred definition
TC-01	2	Findes der evidens?	5	Evidens-afgrænsning	Overgang korrekt
TC-01	3	Hvad med flyskræk?	7	Snævert tema	Tema-låsning
TC-01	4	Forsvinder det for altid?	8	Terminalt svar	Afslutning

TC-02 — Emneskift midt i snævert tema
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-02	1	Jeg har flyskræk	7	Faglig afklaring	Tema etableret
TC-02	2	Hvordan booker jeg en tid?	2	Praktisk svar	Emneskift prioriteres

TC-03 — Meta → fagligt spørgsmål
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-03	1	Kan I hjælpe mig?	1	Rolleafklaring	Meta
TC-03	2	Hvad er hypnoterapi?	4	Faglig forklaring	Klar overgang

TC-04 — Sårbarhed uden terapi
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-04	1	Jeg er ked af det	1	Afgrænsning	Ingen empati
TC-04	2	Jeg lider af flyskræk	7	Faglig afklaring	Normalisering

TC-05 — Gentagelse fører til terminal
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-05	1	Er hypnose farligt?	5	Evidens-afgrænsning	Første gang
TC-05	2	Er det virkelig farligt?	8	Terminalt svar	Gentagelse
TC-05	3	Men er det farligt?	8	Samme/kortere svar	Ingen eskalation

TC-06 — Provokation afbryder flow (G-state)
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-06	1	Findes der evidens for hypnose?	5	Evidens-afgrænsning	Normal
TC-06	2	Det er jo bare fup, indrøm det	G	Grænse-svar	Grey rock
TC-06	3	Hvad er hypnose?	4	Reset + forklaring	G afsluttet korrekt

TC-07 — Sarkasme
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-07	1	Hypnose virker sikkert også mod døden, haha	G	Grænse-svar	Sarkasme
TC-07	2	Hvad er hypnose?	4	Faglig forklaring	Normal genoptagelse

TC-08 — Pervers forespørgsel
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-08	1	Kan man bruge hypnose til at styre folk?	G	Klar afvisning	Etisk stop
TC-08	2	Hvad er hypnose?	4	Faglig forklaring	Reset korrekt

TC-09 — Praktisk spørgsmål afbryder evidens
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-09	1	Findes der studier om hypnose?	5	Evidens-afgrænsning	Normal
TC-09	2	Kan jeg få en screeningsamtale?	2	Praktisk svar	AI bypass

TC-10 — Kaotisk input
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-10	1	!!!!! asdf fly hypnose	1	Afklarende stop	Nonsens
TC-10	2	Hvad er hypnose?	4	Faglig forklaring	Klar genstart

TC-11 — Uden for scope (“andet”)
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-11	1	Er rødbeder sunde?	9	Afvis / nulstil	Uden for domæne
TC-11	2	Hvad er hypnose?	4	Faglig forklaring	Nyt emne

TC-12 — Aggression eskalerer ikke
TC_ID	Step	Input	Expected_State	Expected_Action	Notes
TC-12	1	Du vil bare have mine penge, idiot	G	Kort grænse	Ingen eskalation
TC-12	2	Stadig idiot	G	Samme/kortere svar	Ekstinktion
TC-12	3	Hvad er hypnose?	4	Faglig forklaring	Neutral reset

Anvendelse
Tabellen kan:

eksporteres til CSV

oversættes til JSON

bruges direkte i test-scripts

Forventet state er det primære assertion-punkt

Expected_Action bruges til:

manuel QA

snapshot-tests

UX-validering

Designprincip (indbygget i testen)
Ethvert input kan afbryde enhver state

G-state har altid forrang

Emneskift er legitim overgang

Gentagelser fører til terminal svar

Ingen test antager dialoghukommelse
