# System Overview

Dette projekt beskriver et AI-baseret fagligt afklaringsværktøj.
Det er ikke en chatbot, ikke rådgivning og ikke behandling.

Formål:
- Give faglig afklaring og information om hypnoterapi og relaterede emner
- Afgrænse evidens, begreber og risici
- Sikre etisk, juridisk og psykologisk robust adfærd

Arkitektur:
Browser → Server → AI API

Grundprincip:
- AI er stateless pr. kald
- UI + server fungerer som en state machine
- AI bruges som et kontrolleret tekstmodul
- Systemet ejer struktur, etik og grænser
