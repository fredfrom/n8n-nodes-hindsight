# Project Research Summary

**Project:** n8n-nodes-hindsight
**Domain:** n8n community node wrapping a REST API (Hindsight AI Memory API by Vectorize.io)
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

This project is a single n8n community node package that wraps the Hindsight AI Memory API (v0.4.20, 53 endpoints). The standard approach for building this is well-established: follow the `n8n-io/n8n-nodes-starter` template exactly, use the programmatic node style with a resource/operation dispatch pattern, and ship zero runtime dependencies. The entire build toolchain (`@n8n/node-cli`, ESLint 9 flat config, Prettier with tabs, TypeScript 5.9.3) is prescribed by the starter repo. There is no meaningful stack decision to make -- deviate from the starter template and you fight the linter.

The recommended approach is a single `Hindsight` node class with resources (Bank, Memory, Directive, Mental Model, Document, Entity, Operation, Webhook, Tag) and per-resource operations. The credential class (`HindsightApi`) handles API key injection via Bearer token header and provides a configurable base URL for self-hosted vs cloud deployments. A centralized transport helper (`hindsightApiRequest`) handles URL construction and auth delegation. The API surface is large (50 non-monitoring endpoints), but most are simple CRUD -- the complexity lives in the three core memory operations (Retain, Recall, Reflect) which have rich parameter sets.

The key risks are: (1) naming convention mismatches causing the node to silently not load -- lock down names at scaffolding time and never change them; (2) the exact auth header format needs verification against a running Hindsight instance (the OpenAPI spec shows `authorization` as optional, Bearer format likely); (3) deprecated API fields appearing in the UI -- the spec has many deprecated fields that must be filtered during implementation; (4) the 40+ n8n linter rules around descriptions, display names, and parameter conventions create a wall of lint errors if not followed from the start.

## Key Findings

### Recommended Stack

The stack is entirely dictated by the n8n-nodes-starter repo. There are no technology choices to make -- using anything other than the prescribed toolchain will cause build or lint failures.

**Core technologies:**
- **TypeScript 5.9.3**: Language -- pinned by starter repo, required for n8n type definitions
- **n8n-workflow (peer dep, `*`)**: Runtime types and helpers -- provided by n8n at runtime, never bundled
- **@n8n/node-cli**: Build, lint, dev server, release -- replaces raw tsc/eslint, enforces n8n conventions
- **Node.js >= 18.17**: Runtime -- n8n 1.0+ requirement; Node 20 LTS recommended for dev
- **Zero runtime dependencies**: All HTTP, JSON, and error handling comes from n8n-workflow at runtime

### Expected Features

The Hindsight API has 50 non-monitoring endpoints across 10 resource categories. The FEATURES.md research produced a complete endpoint inventory with request/response schemas.

**Must have (table stakes):**
- Memory > Retain (store memories) -- core purpose
- Memory > Recall (search memories) -- core retrieval
- Memory > Reflect (generate answers from memories) -- core reasoning
- Bank > Create/Update, List, Get Profile, Get Stats, Delete -- prerequisite for everything

**Should have (differentiators):**
- Directive CRUD -- controls reasoning behavior, 5 simple endpoints
- Mental Model CRUD + Refresh -- pre-computed summaries, 7 endpoints
- Document management -- track source documents, 4 endpoints
- Entity browsing -- explore extracted entities, 2 endpoints
- Bank Config Get/Update/Reset -- fine-tune extraction and reasoning
- Operation monitoring -- track async retain jobs
- Tag listing, Consolidation trigger, Clear memories/observations
- Webhook management -- event-driven workflow integration

**Defer (v2+):**
- File upload (multipart/form-data -- poor n8n support in programmatic nodes)
- Memory graph (returns visualization data, no value in JSON context)
- Chunk details (low-level internal reference)
- Tag groups (complex recursive boolean tree, poor UX)
- Observation history per memory (niche debugging)
- All deprecated endpoints (regenerate entity, add background)

### Architecture Approach

Single-node package with one node class (`Hindsight`) using the resource/operation dispatch pattern. Per-resource field definitions are split into separate files under `resources/<resourceName>/`, keeping the main node file clean. A shared transport helper centralizes HTTP requests with auth and base URL handling.

**Major components:**
1. **HindsightApi.credentials.ts** -- API key + base URL storage; Bearer token header injection via `IAuthenticateGeneric`; credential test via `GET /banks`
2. **Hindsight.node.ts** -- Node description with resource selector, operation dropdowns, and `execute()` method that dispatches to per-resource/operation handlers
3. **resources/<resource>/index.ts** -- Per-resource modules exporting `INodeProperties[]` arrays (operation dropdown + per-operation field definitions)
4. **resources/<resource>/<operation>.ts** -- Per-operation field definitions with `displayOptions` scoping
5. **shared/transport.ts** -- `hindsightApiRequest()` helper that builds URLs from credentials and delegates auth to `httpRequestWithAuthentication`

### Critical Pitfalls

1. **Naming convention mismatches (#1)** -- Class name, file name, directory name, and package.json paths must align exactly. Mismatch = node silently does not appear in n8n. Lock names at scaffolding and run `npm run build && npm run lint` after any rename.

2. **package.json n8n block misconfiguration (#2)** -- Missing `n8n-community-node-package` keyword, wrong path format, non-number `n8nNodesApiVersion`, default description/author. All caught by lint but must be correct before any node code is written.

3. **Missing continueOnFail error handling (#3)** -- Every `execute()` item loop must wrap in try/catch, check `this.continueOnFail()`, and only throw `NodeApiError`/`NodeOperationError` with `itemIndex`. Without this, a single API error crashes the entire workflow.

4. **Deprecated API helper (#4)** -- `this.helpers.request()` was removed in n8n v1.0. Many tutorials still show it. Use `this.helpers.httpRequestWithAuthentication()` exclusively.

5. **Deprecated Hindsight fields in UI (#5)** -- The API has many deprecated fields (`disposition` on CreateBank, `background`, `document_tags`, `context` on reflect). Exposing these creates a maintenance liability. Filter them during implementation.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Project Scaffolding and Credential

**Rationale:** Everything depends on correct project setup and working authentication. The naming convention and package.json pitfalls (#1, #2) are the most common causes of failure. Getting a buildable, lintable project with verified credentials eliminates the riskiest unknowns first.

**Delivers:** Buildable project skeleton that passes `npm run build && npm run lint`; working credential type that can authenticate against Hindsight API; transport helper ready for all operations.

**Addresses:** Credential setup, project structure, build toolchain

**Avoids:** Pitfalls #1 (naming), #2 (package.json), #8 (auth header), #11 (icon), #17 (apiVersion), #21 (trailing slash)

### Phase 2: Core Operations (Bank + Memory)

**Rationale:** Bank management is a prerequisite for all other operations (pitfall #13: bank must exist). The three core memory operations (Retain, Recall, Reflect) are the table-stakes features that make the node useful. Building Bank first (simpler CRUD) validates the resource/operation pattern end-to-end before tackling the more complex Memory operations.

**Delivers:** Fully functional node with Bank CRUD (Create/Update, List, Get Profile, Get Stats, Delete) and Memory core ops (Retain, Recall, Reflect). This is a shippable MVP.

**Addresses:** All 8 table-stakes features from FEATURES.md

**Avoids:** Pitfalls #3 (continueOnFail), #4 (deprecated helper), #5 (deprecated fields), #6 (description rules), #7 (collection required), #9 (return shape), #10 (multi-item), #12 (sync/async retain), #13 (bank must exist)

### Phase 3: Configuration and Directives

**Rationale:** Bank Config and Directives shape how Retain/Recall/Reflect behave. Users who have completed Phase 2 workflows will immediately want to tune behavior. Directives are simple CRUD. Config is straightforward but needs care around free-form keys (pitfall #22) and disposition ranges (pitfall #23).

**Delivers:** Bank Config (Get/Update/Reset), Bank Disposition Update, Directive CRUD (5 endpoints), Memory extras (List, Clear, Clear Observations), Tag listing, Consolidation trigger.

**Addresses:** Configuration, directives, memory management, tags, consolidation

**Avoids:** Pitfalls #14 (tag matching defaults), #22 (config free-form), #23 (disposition range)

### Phase 4: Extended Resources

**Rationale:** Mental Models, Documents, Entities, and Operations are valuable but not essential for core workflows. They follow the same CRUD patterns established in Phases 2-3. Mental Models have the most complexity (custom ID constraints, trigger configuration, refresh).

**Delivers:** Mental Model CRUD + Refresh (7 endpoints), Document management (4 endpoints), Entity browsing (2 endpoints), Operation monitoring (4 endpoints).

**Addresses:** Mental models, documents, entities, async operation tracking

**Avoids:** Pitfall #20 (mental model ID constraints)

### Phase 5: Webhooks and Polish

**Rationale:** Webhook management is a differentiator but requires external URL infrastructure that not all users have. Best delivered after the core experience is solid. Polish includes codex metadata, documentation, and npm publish preparation.

**Delivers:** Webhook CRUD + List Deliveries (5 endpoints), codex metadata, README, npm publish readiness.

**Addresses:** Event-driven workflows, discoverability, publishing

### Phase Ordering Rationale

- **Dependency chain:** Credential -> Transport -> Bank (prerequisite) -> Memory (core value) -> Config/Directives (tuning) -> Extended resources -> Webhooks
- **Risk front-loading:** Phase 1 eliminates the most common failure modes (naming, package.json, auth). Phase 2 validates the core pattern with both simple (Bank) and complex (Memory) operations.
- **Incremental shippability:** Each phase produces a usable node. Phase 2 is a viable MVP. Phases 3-5 are additive.
- **Pattern reuse:** The resource/operation/additionalFields pattern established in Phase 2 is reused identically in every subsequent phase. No new architectural patterns after Phase 2.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Auth header format needs verification against a running Hindsight instance. The OpenAPI spec shows `authorization` as optional with no formal `securitySchemes`. Likely `Authorization: Bearer {key}` but must confirm.
- **Phase 2 (Retain):** The `observation_scopes` and `strategy` fields on Retain need careful UX design -- complex enum/array types that map awkwardly to n8n parameter types.
- **Phase 2 (Reflect):** The `response_schema` field (arbitrary JSON Schema) needs a UX decision -- free-form JSON field vs. omitting from v1.

Phases with standard patterns (skip research-phase):
- **Phase 3:** Directives and Config are straightforward CRUD/PATCH operations with well-documented request/response shapes.
- **Phase 4:** All resources follow identical CRUD patterns already established. Mental Model trigger config is the only mildly complex area.
- **Phase 5:** Webhook CRUD is standard. npm publishing is documented in the starter repo.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Entirely prescribed by n8n-nodes-starter; verified against official repo and npm |
| Features | HIGH | Complete endpoint inventory from OpenAPI spec v0.4.20; all request/response schemas documented |
| Architecture | HIGH | Follows canonical n8n multi-resource node pattern from starter repo and official docs |
| Pitfalls | HIGH | 23 pitfalls identified from official docs, linter rules, community forums, and API spec |

**Overall confidence:** HIGH

### Gaps to Address

- **Auth header format:** The OpenAPI spec does not define formal `securitySchemes`. Research indicates `Authorization: Bearer {key}` but this must be verified against a running Hindsight instance during Phase 1 implementation. If wrong, it is a one-line fix in the credential class.
- **Hindsight API stability:** The API is at v0.4.20 (pre-1.0). Deprecated fields suggest active evolution. The node should only expose current (non-deprecated) API surface to minimize breakage risk.
- **`observation_scopes` UX:** The Retain request's `observation_scopes` field accepts either a string enum or a `string[][]` (array of arrays). Mapping this to n8n parameter types cleanly needs a UX decision during Phase 2 planning.
- **`response_schema` on Reflect:** Accepting arbitrary JSON Schema as a parameter. Options: free-form JSON field (flexible but error-prone) or omit from v1 (simpler but less powerful). Decide during Phase 2 planning.
- **Self-hosted vs Cloud auth:** Auth is optional on self-hosted but required on Cloud. The credential should handle empty API keys gracefully (omit the header rather than sending `Authorization: Bearer `).

## Sources

### Primary (HIGH confidence)
- [Hindsight OpenAPI Specification v0.4.20](https://hindsight.vectorize.io/openapi.json) -- complete endpoint inventory, request/response schemas, deprecated field markers
- [n8n-nodes-starter repo](https://github.com/n8n-io/n8n-nodes-starter) -- package.json, tsconfig, eslint config, file structure, naming conventions
- [n8n official docs: Creating Nodes](https://docs.n8n.io/integrations/creating-nodes/) -- programmatic style, credential files, node file structure, HTTP helpers, error handling, UX guidelines, linter rules
- [@n8n/node-cli (npm)](https://www.npmjs.com/package/@n8n/node-cli) -- build/lint/dev/release commands
- [n8n-workflow (npm)](https://www.npmjs.com/package/n8n-workflow) -- type exports, current version 2.13.0
- [eslint-plugin-n8n-nodes-base](https://github.com/ivov/eslint-plugin-n8n-nodes-base) -- full rule list for linter pitfalls

### Secondary (MEDIUM confidence)
- [DeepWiki: Programmatic Style Nodes](https://deepwiki.com/n8n-io/n8n-docs/) -- third-party synthesis of n8n patterns
- [Franky's Notes: Custom n8n Node Guide (Jan 2026)](https://www.frankysnotes.com/2026/01/writing-my-first-custom-n8n-node-step.html) -- community tutorial
- [Sankalp Khawade: Building Custom Nodes (Jul 2025)](https://medium.com/@sankalpkhawade/building-custom-nodes-in-n8n-a-complete-developers-guide-0ddafe1558ca) -- community tutorial
- [n8n Community Forums](https://community.n8n.io/) -- naming errors, httpRequest vs request, node not appearing

### Tertiary (LOW confidence)
- Exact Hindsight auth header format -- inferred from OpenAPI spec but not verified against running instance

---
*Research completed: 2026-03-26*
*Ready for roadmap: yes*
