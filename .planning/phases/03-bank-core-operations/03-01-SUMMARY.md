---
phase: 03-bank-core-operations
plan: 01
subsystem: api
tags: [n8n, INodeProperties, bank, resource-operations, displayOptions]

requires:
  - phase: 02-credentials-transport
    provides: transport helper and credential type for API requests
provides:
  - bankDescription INodeProperties[] array with 5-operation dropdown and per-operation field definitions
  - Resource module pattern (index.ts + per-operation files) template for all future resources
affects: [03-02, 04-core-memory-operations, 05-bank-configuration, 07-directives, 08-mental-models, 09-documents-entities-operations, 10-webhooks]

tech-stack:
  added: []
  patterns: [resource-module-pattern, per-operation-field-pattern, displayOptions-scoping, additional-fields-collection]

key-files:
  created:
    - nodes/Hindsight/resources/bank/index.ts
    - nodes/Hindsight/resources/bank/createOrUpdate.ts
    - nodes/Hindsight/resources/bank/list.ts
    - nodes/Hindsight/resources/bank/getProfile.ts
    - nodes/Hindsight/resources/bank/getStats.ts
    - nodes/Hindsight/resources/bank/delete.ts
  modified: []

key-decisions:
  - "Alphabetized operation options in dropdown (Create or Update, Delete, Get Profile, Get Stats, List)"
  - "Used const displayFor pattern per file for DRY displayOptions scoping"
  - "list.ts exports empty array since List Banks has no parameters"

patterns-established:
  - "Resource module pattern: index.ts exports description array with operation dropdown + spread per-operation fields"
  - "Per-operation field pattern: each file exports INodeProperties[] with displayOptions scoped to resource+operation"
  - "Additional Fields collection for optional params with alphabetized items, no required:true inside"
  - "displayFor const per file for DRY displayOptions references"

requirements-completed: [BANK-01, BANK-02, BANK-03, BANK-04, BANK-05, UX-01, UX-02]

duration: 1min
completed: 2026-03-26
---

# Phase 3 Plan 1: Bank Resource Property Definitions Summary

**Bank resource with 5-operation dropdown (Create/Update, Delete, Get Profile, Get Stats, List) and per-operation field definitions using n8n displayOptions scoping pattern**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-26T21:43:10Z
- **Completed:** 2026-03-26T21:44:30Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created 6-file Bank resource module establishing the pattern all subsequent resources will follow
- Operation dropdown with 5 alphabetized options, each with action property for linter compliance
- Create/Update operation uses Additional Fields collection for optional name and mission parameters
- TypeScript type check passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create per-operation Bank field definitions** - `9e32543` (feat)
2. **Task 2: Create Bank resource index with operation dropdown** - `1c04ac6` (feat)

## Files Created/Modified
- `nodes/Hindsight/resources/bank/index.ts` - Bank resource entry point: operation dropdown + bankDescription export
- `nodes/Hindsight/resources/bank/createOrUpdate.ts` - Create/Update fields: bankId (required) + Additional Fields (mission, name)
- `nodes/Hindsight/resources/bank/list.ts` - List fields: empty array (no parameters)
- `nodes/Hindsight/resources/bank/getProfile.ts` - Get Profile fields: bankId (required)
- `nodes/Hindsight/resources/bank/getStats.ts` - Get Stats fields: bankId (required)
- `nodes/Hindsight/resources/bank/delete.ts` - Delete fields: bankId (required)

## Decisions Made
- Alphabetized operation options in dropdown for consistency (matching Pitfall 15 guidance)
- Used local `const displayFor` pattern in each file for DRY displayOptions scoping
- list.ts exports empty array since the List Banks API takes no parameters
- Deprecated fields (disposition, background, disposition_skepticism, etc.) excluded per Pitfall 5

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- bankDescription is ready to be spread into the main node's properties array in Plan 03-02
- Plan 03-02 will wire these definitions into Hindsight.node.ts and implement execute() dispatch logic
- The resource module pattern established here serves as the template for Memory, Directive, Mental Model, etc.

---
*Phase: 03-bank-core-operations*
*Completed: 2026-03-26*
