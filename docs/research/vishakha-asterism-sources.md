# Vishakha: asterism research

## Decision

A closed four-star quadrilateral -- the existing yogatara Zubenelgenubi
(α Librae) joined by Beta, Gamma, and Iota Librae. New
`VISHAKHA_EXTRA_STARS` group, sharing `nodeId: "vishakha"` with the
existing yogatara.

## Sourcing

- **Stars**: "Vishakha consists of four stars in the constellation of
  Libra: Alpha, Beta, Gamma, and Iota Librae... arranged in the shape of
  a pylon: Alpha Librae (Pada 1); Beta Librae (Pada 2); Gamma Librae
  (Pada 3); Iota Librae (Pada 4)" -- explicitly four named stars in a
  stated pada sequence, matching the existing yogatara plus three
  companions.
- **Symbol**: a triumphal arch or decorated gateway, sometimes an
  archway covered with leaves, or a potter's wheel -- "vishakha" itself
  means "forked" or "two-branched." The gateway/arch reading fits a
  four-cornered shape well.
- **Ruling deities**: Indra-Agni, a combined force of thunder/war/victory
  (Indra) and fire/transformation (Agni).

## Coordinates used

| Star | RA (h) | Dec (°) | Mag | Source |
|---|---|---|---|---|
| Zubenelgenubi / α Librae (existing yogatara) | 14.848 | -16.042 | 2.75 | unchanged from existing catalog entry |
| Beta Librae (Zubeneschamali) | 15.2835 | -9.3829 | 2.61 | [Wikipedia: Beta Librae](https://en.wikipedia.org/wiki/Beta_Librae) |
| Gamma Librae (Zubenelakrab) | 15.5921 | -14.7896 | 3.91 | [Wikipedia: Gamma Librae](https://en.wikipedia.org/wiki/Gamma_Librae) |
| Iota Librae (Iota¹) | 15.2037 | -19.7917 | 4.54 | [Wikipedia: Iota1 Librae](https://en.wikipedia.org/wiki/Iota1_Librae) |

Checked the stated pada order (Alpha -> Beta -> Gamma -> Iota) against the
real positions for self-intersection (parametrizing each segment and
checking for overlapping x/y ranges) -- it traces a clean, non-crossing
quadrilateral, so the traditional pada sequence was kept rather than
recomputed. Traversal path (closed): Alpha Librae -> Beta Librae -> Gamma
Librae -> Iota Librae -> Alpha Librae.

## Placeholder figure

A simple decorated archway/gateway (the primary sourced symbol), matching
the real four-star quadrilateral.
