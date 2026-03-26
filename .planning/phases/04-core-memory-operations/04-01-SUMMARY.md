---
phase: 04-core-memory-operations
plan: 01
subsystem: ui
tags: [n8n, INodeProperties, memory, retain, recall, reflect]

requires:
  - phase: 03-bank-core-operations
    provides: Resource module pattern (index.ts + per-operation field files)
provides:
  - Memory resource property definitions (Retain, Recall, Reflect)
  - memoryDescription export for node wiring
affects: [04-02-wire-memory-execute]

tech-stack:
  added: []
  patterns: [memory resource field definitions following bank pattern]

key-files:
  created:
    - nodes/Hindsight/resources/memory/index.ts
    - nodes/Hindsight/resources/memory/retain.ts
    - nodes/Hindsight/resources/memory/recall.ts
    - nodes/Hindsight/resources/memory/reflect.ts
  modified: []

key-decisions:
  - "Operations listed alphabetically in dropdown (Recall, Reflect, Retain) with default 'retain'"
  - "Additional Fields options sorted alphabetically within each collection"

patterns-established:
  - "Memory resource follows same index.ts + per-operation files pattern as Bank"

requirements-completed: [MEM-01, MEM-02, MEM-03]

duration: 1min
completed: 2026-03-26
---

# Phase 04 Plan 01: Memory Resource Property Definitions Summary

**Retain, Recall, and Reflect operation field definitions with full API parameter coverage via Additional Fields collections**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-26T20:58:14Z
- **Completed:** 2026-03-26T20:59:32Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Retain operation with bankId + content required, 9 optional fields (timestamp, context, metadata, documentId, entities, tags, observationScopes, strategy, async)
- Recall operation with bankId + query required, 10 optional fields (types multiOptions, budget, maxTokens, trace, queryTimestamp, tags, tagsMatch, includeEntities, includeChunks, includeSourceFacts)
- Reflect operation with bankId + query required, 7 optional fields (budget, maxTokens, responseSchema JSON, tags, tagsMatch, includeFacts, includeToolCalls)
- Memory index.ts with operations dropdown and memoryDescription aggregated export

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Retain operation field definitions** - `2940e7a` (feat)
2. **Task 2: Create Recall and Reflect field definitions plus Memory index** - `a0ed851` (feat)

## Files Created/Modified
- `nodes/Hindsight/resources/memory/retain.ts` - Retain operation fields (bankId, content required + 9 optional in Additional Fields)
- `nodes/Hindsight/resources/memory/recall.ts` - Recall operation fields (bankId, query required + 10 optional in Additional Fields)
- `nodes/Hindsight/resources/memory/reflect.ts` - Reflect operation fields (bankId, query required + 7 optional in Additional Fields)
- `nodes/Hindsight/resources/memory/index.ts` - Operations dropdown + memoryDescription combining all field arrays

## Decisions Made
- Operations listed alphabetically in dropdown (Recall, Reflect, Retain) with default 'retain' since storing is the most common first action
- Additional Fields options sorted alphabetically within each collection for consistency
- bankId as required field on all three operations (not in Additional Fields) since bank context is always needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All Memory property definitions complete with full API parameter coverage
- Ready for Plan 04-02 to wire memoryDescription into node and implement execute methods

## Self-Check: PASSED

- [x] nodes/Hindsight/resources/memory/retain.ts exists
- [x] nodes/Hindsight/resources/memory/recall.ts exists
- [x] nodes/Hindsight/resources/memory/reflect.ts exists
- [x] nodes/Hindsight/resources/memory/index.ts exists
- [x] Commit 2940e7a exists
- [x] Commit a0ed851 exists
