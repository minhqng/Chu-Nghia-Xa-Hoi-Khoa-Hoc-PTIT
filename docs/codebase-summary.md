# Codebase Summary

## Overview

React + Vite + TypeScript SPA for rapid CNXH multiple-choice practice.

## Main Areas

- `src/data`: Imports and normalizes the 14 JSON question files.
- `src/lib`: Quiz scoring, exam creation, answer status, localStorage helpers.
- `src/components`: Source selector, mode switch, question card, palette, exam setup, result view.
- `scripts/validate-data.mjs`: Data validation for question shape and correctness markers.

## Data Rules

- Stable question id format: `bank-<chapter>-<index>` or `theory-<chapter>-<index>`.
- Valid answer count: 2 or 4.
- Each question must have exactly one answer with `weight > 0`.
- Practice progress stored per source/chapter; exam stores fixed random ids.

## Verification

- `npm run validate:data`
- `npm run test`
- `npm run build`

## Unresolved Questions

None.
