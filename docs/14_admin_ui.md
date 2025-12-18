# Admin UI – Version 1

Admin UI er et internt værktøj,
kun tilgængeligt for systemejeren.
Formål
md
Kopier kode
- Gennemse sessioner
- Forstå systemets adfærd over tid
- Identificere fejl, mønstre og edge cases
Funktioner
md
Kopier kode
- Login (simpel beskyttelse i V1)
- Liste over sessioner:
  - session_id
  - start/slut
  - IP / geo
  - antal inputs
  - evt. G-state markør

- Session-detailvisning:
  - kronologisk liste af inputs
  - samme felter som i Test Workbench
Begrænsninger (bevidst)
md
Kopier kode
- Read-only
- Ingen redigering
- Ingen replay
- Ingen analytics
