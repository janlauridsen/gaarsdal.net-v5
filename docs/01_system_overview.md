# System Overview

Dette projekt beskriver et AI-baseret fagligt afklaringsværktøj.
Det er ikke en chatbot, ikke rådgivning og ikke behandling.

Formål:
- Give faglig afklaring og information om hypnoterapi og relaterede emner
- Afgrænse evidens, begreber og risici
- Sikre etisk, juridisk og psykologisk robust adfærd

Arkitektur (V1):

Browser → Vercel Serverless Function (/api/evaluate)
        → State Resolver (stateless)
        → AI API (kontrolleret)
        → Post-analysis (lint)
        → In-memory logging

Grundprincip:
Begrænsninger i V1:
- Ingen persistence
- Ingen replay
- Ingen brugerprofiler
- Ingen adaptiv logik

Disse er bevidste fravalg i V1.

