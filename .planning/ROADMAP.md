# Roadmap: n8n-nodes-hindsight

## Overview

This roadmap delivers a complete n8n community node package wrapping the Hindsight AI Memory API. It progresses from project scaffolding through authentication, then builds the core Bank and Memory operations that deliver immediate value, followed by the full API surface (configuration, directives, mental models, documents, entities, operations, webhooks), and finishes with documentation. Each phase produces a buildable, lintable increment. After Phase 4, the node is a shippable MVP.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Scaffolding** - Scaffold from n8n-nodes-starter with correct structure, naming, build, and lint
- [ ] **Phase 2: Credentials & Transport** - API key credential type with test button and shared HTTP request helper
- [ ] **Phase 3: Bank Core Operations** - Bank CRUD plus resource/operation UX patterns (error handling, multi-item, additional fields)
- [ ] **Phase 4: Core Memory Operations** - Retain, Recall, and Reflect -- the three operations that make the node useful
- [ ] **Phase 5: Bank Configuration & Disposition** - Config get/update/reset and disposition tuning for bank behavior control
- [ ] **Phase 6: Bank Utilities & Memory Management** - Consolidation, tags, clear observations, plus memory list/get/clear operations
- [ ] **Phase 7: Directives** - Full directive CRUD for controlling reasoning behavior
- [ ] **Phase 8: Mental Models** - Mental model CRUD, history, and refresh for pre-computed summaries
- [ ] **Phase 9: Documents, Entities & Operations** - Document management, entity browsing, and async operation tracking
- [ ] **Phase 10: Webhooks & Documentation** - Webhook management and README with install/usage instructions

## Phase Details

### Phase 1: Project Scaffolding
**Goal**: A buildable, lintable TypeScript project exists with correct n8n community node structure
**Depends on**: Nothing (first phase)
**Requirements**: SETUP-01, SETUP-02, SETUP-03, SETUP-04
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes with zero errors
  2. `npm run lint` completes with zero errors
  3. Package.json contains correct n8n block with n8nNodesApiVersion, nodes path, credentials path, and n8n-community-node-package keyword
  4. File structure matches n8n-nodes-starter conventions (nodes/, credentials/ directories, correct file naming)
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Scaffold all config files, skeleton node/credential, install deps, verify build+lint

### Phase 2: Credentials & Transport
**Goal**: The node can authenticate against any Hindsight instance (self-hosted or cloud) and make API requests
**Depends on**: Phase 1
**Requirements**: CRED-01, CRED-02, CRED-03, TRANS-01, TRANS-02
**Success Criteria** (what must be TRUE):
  1. User can configure a Hindsight credential with API key and base URL (defaulting to localhost:8888)
  2. Credential test button validates connectivity by hitting GET /v1/default/banks
  3. API requests use Bearer token auth when API key is provided, and omit the header when empty (self-hosted no-auth)
  4. All API calls route through the shared transport helper (no direct httpRequest calls)
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Finalize credential with conditional auth, create transport helper, wire node execute

### Phase 3: Bank Core Operations
**Goal**: Users can manage Hindsight banks from n8n with a clean resource/operation UX that establishes patterns for all subsequent resources
**Depends on**: Phase 2
**Requirements**: BANK-01, BANK-02, BANK-03, BANK-04, BANK-05, UX-01, UX-02, UX-03, UX-04, UX-05
**Success Criteria** (what must be TRUE):
  1. User can create/update, list, get profile, get stats, and delete banks from n8n
  2. Resource dropdown shows "Bank" with its operations grouped logically
  3. Required fields appear upfront; optional fields live in Additional Fields collections
  4. A single API error does not crash the workflow -- continueOnFail pattern works correctly
  5. Node processes all input items (multi-item loop), returning raw JSON for each
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Bank resource property definitions (operation dropdown + per-operation field files)
- [x] 03-02-PLAN.md — Wire bankDescription into node and implement all 5 Bank operations in execute method

### Phase 4: Core Memory Operations
**Goal**: Users can store memories, search memories, and get AI-generated responses from memories -- the core value of Hindsight
**Depends on**: Phase 3
**Requirements**: MEM-01, MEM-02, MEM-03
**Success Criteria** (what must be TRUE):
  1. User can retain (store) a memory with content and optional metadata, timestamp, tags, entities, document_id, observation_scopes, strategy, and async flag
  2. User can recall (search) memories with a query and optional type filters, budget, max_tokens, trace, tags, and include options
  3. User can reflect (generate AI response) with a query and optional budget, max_tokens, response_schema, tags, and include options
  4. All three operations expose required fields upfront and optional fields in Additional Fields collections
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — Memory resource property definitions (operation dropdown + retain/recall/reflect field files)
- [x] 04-02-PLAN.md — Wire memoryDescription into node and implement all 3 Memory operations in execute method

### Phase 5: Bank Configuration & Disposition
**Goal**: Users can fine-tune how a bank processes and reasons about memories
**Depends on**: Phase 3
**Requirements**: BANK-06, BANK-07, BANK-08, BANK-09
**Success Criteria** (what must be TRUE):
  1. User can get the current resolved configuration for a bank
  2. User can update bank configuration with key-value pairs and reset to server defaults
  3. User can update a bank's disposition (skepticism, literalism, empathy on 1-5 scale)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Bank Utilities & Memory Management
**Goal**: Users can trigger consolidation, browse tags, clear observations, and manage individual memories
**Depends on**: Phase 4, Phase 5
**Requirements**: BANK-10, BANK-11, BANK-12, MEM-04, MEM-05, MEM-06, MEM-07
**Success Criteria** (what must be TRUE):
  1. User can trigger bank consolidation (observation synthesis)
  2. User can list tags for a bank with optional search, limit, and offset
  3. User can clear all observations for a bank
  4. User can list, get, and clear memories (with optional type filter), and clear observations for a specific memory
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Directives
**Goal**: Users can create and manage directives that control how a bank reasons about memories
**Depends on**: Phase 3
**Requirements**: DIR-01, DIR-02, DIR-03, DIR-04, DIR-05
**Success Criteria** (what must be TRUE):
  1. User can create a directive with name, content, and optional priority/is_active/tags
  2. User can list, get, update, and delete directives for a bank
  3. Directive resource appears in the resource dropdown alongside Bank and Memory
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Mental Models
**Goal**: Users can create and manage pre-computed mental model summaries that refresh on triggers or manually
**Depends on**: Phase 3
**Requirements**: MM-01, MM-02, MM-03, MM-04, MM-05, MM-06, MM-07
**Success Criteria** (what must be TRUE):
  1. User can create a mental model with name, source_query, and optional ID/tags/max_tokens/trigger config
  2. User can list, get, update, and delete mental models
  3. User can view a mental model's history of past computations
  4. User can manually trigger a mental model refresh
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

### Phase 9: Documents, Entities & Operations
**Goal**: Users can manage source documents, browse extracted entities, and track async operations
**Depends on**: Phase 3
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04, ENT-01, ENT-02, OPS-01, OPS-02, OPS-03, OPS-04
**Success Criteria** (what must be TRUE):
  1. User can list, get, update tags, and delete documents for a bank
  2. User can list and get entities extracted by Hindsight
  3. User can list, get, cancel, and retry async operations
  4. All three resources (Document, Entity, Operation) appear in the resource dropdown
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD
- [ ] 09-03: TBD

### Phase 10: Webhooks & Documentation
**Goal**: Users can manage Hindsight webhooks for event-driven workflows and have clear documentation for installation and usage
**Depends on**: Phase 9
**Requirements**: WH-01, WH-02, WH-03, WH-04, WH-05, DOC-R01, DOC-R02, DOC-R03
**Success Criteria** (what must be TRUE):
  1. User can create, list, update, and delete webhooks with URL, secret, event types, and HTTP config
  2. User can list delivery attempts for a webhook
  3. README contains install instructions for n8n custom extensions directory
  4. README contains credential setup instructions and one usage example per resource
**Plans**: TBD

Plans:
- [ ] 10-01: TBD
- [ ] 10-02: TBD
- [ ] 10-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffolding | 0/1 | Planning complete | - |
| 2. Credentials & Transport | 0/1 | Planning complete | - |
| 3. Bank Core Operations | 1/2 | In Progress|  |
| 4. Core Memory Operations | 0/2 | Planning complete | - |
| 5. Bank Configuration & Disposition | 0/2 | Not started | - |
| 6. Bank Utilities & Memory Management | 0/2 | Not started | - |
| 7. Directives | 0/2 | Not started | - |
| 8. Mental Models | 0/2 | Not started | - |
| 9. Documents, Entities & Operations | 0/3 | Not started | - |
| 10. Webhooks & Documentation | 0/3 | Not started | - |
