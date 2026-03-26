# Phase 6: Bank Utilities & Memory Management Summary

**One-liner:** Bank consolidation, tag listing, observation clearing plus memory CRUD (list/get/clear/clear-observations) with full query param support

## What Was Done

### Bank Operations Added (3)

1. **Consolidate** (BANK-10): `POST /v1/default/banks/{bank_id}/consolidate` -- triggers observation synthesis, returns operation_id
2. **List Tags** (BANK-11): `GET /v1/default/banks/{bank_id}/tags` -- optional query params q, limit (default 50), offset via Additional Fields
3. **Clear Observations** (BANK-12): `DELETE /v1/default/banks/{bank_id}/observations` -- clears all observations in a bank

### Memory Operations Added (4)

4. **List** (MEM-04): `GET /v1/default/banks/{bank_id}/memories/list` -- optional type filter (world/experience/observation), search, limit (default 50), offset via Additional Fields
5. **Get** (MEM-05): `GET /v1/default/banks/{bank_id}/memories/{memory_id}` -- required bankId and memoryId
6. **Clear** (MEM-06): `DELETE /v1/default/banks/{bank_id}/memories` -- optional type filter (world/experience/observation/opinion) via Additional Fields
7. **Clear Observations** (MEM-07): `DELETE /v1/default/banks/{bank_id}/memories/{memory_id}/observations` -- required bankId and memoryId

## Files Created

- `nodes/Hindsight/resources/bank/consolidate.ts` -- Consolidate field definitions
- `nodes/Hindsight/resources/bank/listTags.ts` -- List Tags field definitions
- `nodes/Hindsight/resources/bank/clearObservations.ts` -- Clear Observations field definitions
- `nodes/Hindsight/resources/memory/list.ts` -- List field definitions
- `nodes/Hindsight/resources/memory/get.ts` -- Get field definitions
- `nodes/Hindsight/resources/memory/clear.ts` -- Clear field definitions
- `nodes/Hindsight/resources/memory/clearObservations.ts` -- Clear Observations field definitions

## Files Modified

- `nodes/Hindsight/resources/bank/index.ts` -- Added 3 new operation options and field spreads
- `nodes/Hindsight/resources/memory/index.ts` -- Added 4 new operation options and field spreads
- `nodes/Hindsight/Hindsight.node.ts` -- Added 7 execute handlers with continueOnFail error handling

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed limit default values**
- **Issue:** n8n linter requires limit fields to default to 50, not 100
- **Fix:** Changed default from 100 to 50 in listTags.ts and memory/list.ts
- **Files modified:** `nodes/Hindsight/resources/bank/listTags.ts`, `nodes/Hindsight/resources/memory/list.ts`

**2. [Rule 3 - Blocking] Added directive resource import**
- **Issue:** The n8n linter auto-organizes and injects directive resource references (from pre-existing Phase 7 directive files). This caused unused-import errors when the import was missing.
- **Fix:** Added `directiveDescription` import and committed directive resource files to keep the build and linter clean.
- **Files modified:** `nodes/Hindsight/Hindsight.node.ts`

## Patterns Followed

- Each field file uses `const displayFor = { resource: [...], operation: [...] }` pattern
- Required fields (bankId, memoryId) shown at top level; optional fields in Additional Fields collection
- Query string params passed via `qs` parameter to `hindsightApiRequest` transport helper
- All execute handlers wrapped in `continueOnFail()` try/catch pattern
- Operation dropdown options alphabetically sorted in both bank and memory indexes

## Verification

- `npm run build` passes
- `npm run lint` passes (zero errors, zero warnings)

## Commits

- `90205c2`: feat(phase6): add bank utilities and memory management operations

## Requirements Completed

- BANK-10: Bank > Consolidate
- BANK-11: Bank > List Tags
- BANK-12: Bank > Clear Observations
- MEM-04: Memory > List
- MEM-05: Memory > Get
- MEM-06: Memory > Clear
- MEM-07: Memory > Clear Observations

## Known Stubs

None -- all operations are fully wired to the API via the transport helper.

## Self-Check: PASSED
