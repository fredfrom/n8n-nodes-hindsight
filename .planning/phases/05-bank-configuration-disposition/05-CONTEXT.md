# Phase 5: Bank Configuration & Disposition - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure — discuss skipped)

<domain>
## Phase Boundary

Add 4 new Bank operations: Update Disposition (PUT profile), Get Config, Update Config, Reset Config.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
Follow established Bank resource pattern. Add operations to existing bank resource files.

**Update Disposition (PUT /v1/default/banks/{bank_id}/profile):**
- Required: bankId, skepticism (1-5), literalism (1-5), empathy (1-5)

**Get Config (GET /v1/default/banks/{bank_id}/config):**
- Required: bankId

**Update Config (PATCH /v1/default/banks/{bank_id}/config):**
- Required: bankId, updates (JSON string of key-value config overrides)

**Reset Config (DELETE /v1/default/banks/{bank_id}/config):**
- Required: bankId

</decisions>

<code_context>
## Existing Code Insights

- nodes/Hindsight/resources/bank/ — existing Bank operations to extend
- nodes/Hindsight/Hindsight.node.ts — execute method to add new cases

</code_context>

<specifics>
## Specific Ideas

None — straightforward extension of existing pattern.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
