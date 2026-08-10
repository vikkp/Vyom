# ADR0001: Foundational Architecture Decision for Vyom

Date: 2026-08-09
Updated: 2026-08-10
Status: Accepted
Deciders: Project initiator + Grok collaboration

Project Name: Vyom
Website: vyomvihar.com
Tagline: Walk the Sky of the Ancients

## Context

We are building an interactive 3D mythology exploration experience centred on Bharatiya (Vedic/Puranic) tradition. The experience is anchored in the celestial sphere — Dhruva Tārā, the Saptarishi, and the 27 Nakshatras — with characters and stories linked through a rich relationship web. The project must feel authentic, immersive, and educational while remaining finite and maintainable for a strong first version.

## Decision

1. Officially name the project Vyom and host it at vyomvihar.com, with the primary tagline "Walk the Sky of the Ancients".
2. Anchor the entire experience in the celestial sphere, with Dhruva Tārā as the fixed centre and the 27 Nakshatras + Saptarishi as the primary navigable ring.
3. Model the content as a directed labelled graph:
   - Nodes = characters, Nakshatras, celestial objects, and major story events.
   - Edges = typed relationships (parent, spouse, guru, enemy, astronomical association, story-link, etc.).
4. Define the v1 node set as the complete core relationship web previously established (Dhruva family + current Saptarishi + 27 Nakshatras with their deities + Trimurti + key Adityas/progenitors). This constitutes the full launch graph.
5. Use photo-realistic visual language with Indian iconographic fidelity and subtle yantra/mandala accents.
6. Support both free exploration (click any relationship edge) and guided story paths.
7. Keep the data model graph-native so future expansion remains non-breaking.

## Consequences

### Positive

- Strong, evocative, and culturally rooted brand identity.
- Clear celestial focus that differentiates the experience.
- Finite yet rich v1 scope that enables high-quality execution.
- Graph structure supports powerful navigation and future growth.

### Negative / Trade-offs

- Requires disciplined content prioritisation.
- Dual need for astronomical accuracy and mythological fidelity.
- Visual consistency across many divine forms remains a significant effort.

## Follow-up ADRs expected

- ADR0002: Exact data schema & storage
- ADR0003: 3D engine, camera & navigation model
- ADR0004: Content pipeline (text + image generation + validation)
- ADR0005: Platform & monetization architecture

---

Vyom – Walk the Sky of the Ancients is now officially recorded.
