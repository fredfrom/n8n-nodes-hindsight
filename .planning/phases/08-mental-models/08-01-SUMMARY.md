# Phase 8: Mental Models Summary

**One-liner:** Full Mental Model CRUD with create/list/get/update/delete plus history and refresh operations, including trigger configuration with fact type filtering

## What Was Built

All 7 Mental Model operations implemented as a new resource in the Hindsight n8n node:

1. **Create** (MM-01): POST /v1/default/banks/{bank_id}/mental-models with name, source_query required; Additional Fields for id, tags, max_tokens, and trigger config (refresh_after_consolidation, fact_types multiOptions, exclude_mental_models)
2. **List** (MM-02): GET /v1/default/banks/{bank_id}/mental-models with bankId required
3. **Get** (MM-03): GET /v1/default/banks/{bank_id}/mental-models/{mental_model_id} with bankId, mentalModelId required
4. **Update** (MM-04): PATCH /v1/default/banks/{bank_id}/mental-models/{mental_model_id} with all fields optional in Additional Fields including trigger config
5. **Delete** (MM-05): DELETE /v1/default/banks/{bank_id}/mental-models/{mental_model_id}
6. **Get History** (MM-06): GET /v1/default/banks/{bank_id}/mental-models/{mental_model_id}/history
7. **Refresh** (MM-07): POST /v1/default/banks/{bank_id}/mental-models/{mental_model_id}/refresh (no body)

## Files Created

- `nodes/Hindsight/resources/mentalModel/create.ts` - Create operation field definitions with trigger fixedCollection
- `nodes/Hindsight/resources/mentalModel/list.ts` - List operation field definitions
- `nodes/Hindsight/resources/mentalModel/get.ts` - Get operation field definitions
- `nodes/Hindsight/resources/mentalModel/update.ts` - Update operation field definitions with trigger fixedCollection
- `nodes/Hindsight/resources/mentalModel/delete.ts` - Delete operation field definitions
- `nodes/Hindsight/resources/mentalModel/getHistory.ts` - Get History operation field definitions
- `nodes/Hindsight/resources/mentalModel/refresh.ts` - Refresh operation field definitions
- `nodes/Hindsight/resources/mentalModel/index.ts` - Resource index with operation dropdown and field spreads

## Files Modified

- `nodes/Hindsight/Hindsight.node.ts` - Added mentalModel import, resource dropdown entry, property spread, and all 7 execute handlers

## Commits

| Hash | Description |
|------|-------------|
| 54c9793 | feat(08): add Mental Model resource with 7 operation field definitions |

Note: The Hindsight.node.ts wiring (import, resource dropdown, execute handlers) was applied concurrently by another agent session that also integrated document/entity/operation resources. The mentalModel handlers are fully present and functional in the node.

## Verification

- `npm run build` passes
- `npm run lint` passes
- Mental Model appears in resource dropdown with all 7 operations
- Trigger config uses fixedCollection with multiOptions for fact types

## Deviations from Plan

None - plan executed as specified.

## Known Stubs

None - all operations are fully wired to API endpoints with complete parameter handling.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| fixedCollection for trigger config | Matches pattern used by retain.ts for entities/metadata; groups related trigger fields together |
| Comma-separated tags (string type) | Consistent with directive and memory resources; simple UX for n8n users |
| multiOptions for factTypes | Allows selecting multiple fact types (world, experience, observation) cleanly in n8n UI |
