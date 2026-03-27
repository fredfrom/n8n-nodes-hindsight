---
phase: "07"
plan: "directives"
subsystem: "directive-resource"
tags: [directive, crud, n8n-node, hindsight-api]
dependency-graph:
  requires: [bank-resource, transport]
  provides: [directive-crud]
  affects: [Hindsight.node.ts, resources/directive/]
tech-stack:
  added: []
  patterns: [resource-operation, additional-fields-collection, tag-csv-parsing]
key-files:
  created:
    - nodes/Hindsight/resources/directive/index.ts
    - nodes/Hindsight/resources/directive/create.ts
    - nodes/Hindsight/resources/directive/list.ts
    - nodes/Hindsight/resources/directive/get.ts
    - nodes/Hindsight/resources/directive/update.ts
    - nodes/Hindsight/resources/directive/delete.ts
  modified:
    - nodes/Hindsight/Hindsight.node.ts
decisions:
  - Directive resource follows identical pattern to bank/memory resources
  - Tags field accepts comma-separated string and converts to string array for API
  - Create requires name + content; Update puts all fields in Additional Fields
metrics:
  completed: "2026-03-27"
---

# Phase 7: Directives Summary

Full CRUD directive resource (create, list, get, update, delete) wired into Hindsight node with bank-scoped API endpoints and Additional Fields for optional parameters.

## What Was Done

### Directive Resource Field Definitions (6 files)

Created `nodes/Hindsight/resources/directive/` with:

- **index.ts** -- Operation dropdown (Create, Delete, Get, List, Update) with `displayOptions` scoped to `resource: ['directive']`; exports `directiveDescription` array
- **create.ts** -- Required fields: bankId, name, content; Additional Fields: priority (number), is_active (boolean), tags (comma-separated string)
- **list.ts** -- Required: bankId
- **get.ts** -- Required: bankId, directiveId
- **update.ts** -- Required: bankId, directiveId; Additional Fields: name, content, priority, is_active, tags (all optional)
- **delete.ts** -- Required: bankId, directiveId

### Node Integration

- Added `Directive` option to resource dropdown in `Hindsight.node.ts`
- Imported and spread `directiveDescription` into node properties
- Added execute handlers for all 5 operations:
  - **Create**: POST `/v1/default/banks/{bank_id}/directives` with body containing name, content, and optional priority/is_active/tags
  - **List**: GET `/v1/default/banks/{bank_id}/directives`
  - **Get**: GET `/v1/default/banks/{bank_id}/directives/{directive_id}`
  - **Update**: PATCH `/v1/default/banks/{bank_id}/directives/{directive_id}` with optional fields in body
  - **Delete**: DELETE `/v1/default/banks/{bank_id}/directives/{directive_id}`

## Verification

- `npm run build` passes
- `npm run lint` passes
- Directive appears in resource dropdown
- All 5 operations available in operation dropdown when Directive is selected

## Deviations from Plan

None -- the directive resource implementation was completed as part of parallel agent work during phases 6 and 9. This execution verified all 5 operations are correctly implemented, field definitions follow established patterns, and the build/lint pass cleanly.

## Commits

The directive work was committed as part of:
- `90205c2` feat(phase6): add bank utilities and memory management operations (included directive field definitions and wiring)
- `c840b48` feat(09): wire document, entity, and operation resources into node (included directive in broader resource wiring)
- `b3a7d83` fix(09): fix syntax errors from merge with mentalModel handler

## Known Stubs

None -- all directive operations are fully wired to API endpoints with proper request body construction.

## Self-Check: PASSED
