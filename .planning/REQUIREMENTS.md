# Requirements: n8n-nodes-hindsight

**Defined:** 2026-03-26
**Core Value:** Expose every useful Hindsight API operation to n8n workflow builders with clean UX

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Project Setup

- [x] **SETUP-01**: Project scaffolded from n8n-nodes-starter with correct file structure, naming, and build toolchain
- [x] **SETUP-02**: Package.json has correct n8n block (n8nNodesApiVersion, nodes, credentials paths, n8n-community-node-package keyword)
- [x] **SETUP-03**: Project builds (`npm run build`) and lints (`npm run lint`) with zero errors on empty node skeleton
- [x] **SETUP-04**: TypeScript throughout with n8n-nodes-starter tsconfig and eslint flat config

### Credential

- [x] **CRED-01**: HindsightApi credential type with API Key field and Base URL field (default: `http://localhost:8888`)
- [x] **CRED-02**: Credential sends `Authorization: Bearer {apiKey}` header on every request; omits header when API key is empty (self-hosted no-auth mode)
- [x] **CRED-03**: Credential test button works (validates against `GET /v1/default/banks`)

### Transport

- [x] **TRANS-01**: Shared `hindsightApiRequest` helper that builds URLs from credential base URL + path, delegates auth to `httpRequestWithAuthentication`
- [x] **TRANS-02**: All API calls go through transport helper (no direct httpRequest calls in operation handlers)

### Bank Resource

- [x] **BANK-01**: Bank > Create or Update — `PUT /v1/default/banks/{bank_id}` with name and mission fields; deprecated fields excluded
- [x] **BANK-02**: Bank > List — `GET /v1/default/banks` returning array of bank summaries
- [x] **BANK-03**: Bank > Get Profile — `GET /v1/default/banks/{bank_id}/profile` returning bank profile
- [x] **BANK-04**: Bank > Get Stats — `GET /v1/default/banks/{bank_id}/stats` returning bank statistics
- [x] **BANK-05**: Bank > Delete — `DELETE /v1/default/banks/{bank_id}` with confirmation awareness
- [ ] **BANK-06**: Bank > Update Disposition — `PUT /v1/default/banks/{bank_id}/profile` with skepticism/literalism/empathy (1-5 each)
- [ ] **BANK-07**: Bank > Get Config — `GET /v1/default/banks/{bank_id}/config` returning resolved config + overrides
- [ ] **BANK-08**: Bank > Update Config — `PATCH /v1/default/banks/{bank_id}/config` with free-form key-value config updates
- [ ] **BANK-09**: Bank > Reset Config — `DELETE /v1/default/banks/{bank_id}/config` resetting to server defaults
- [ ] **BANK-10**: Bank > Consolidate — `POST /v1/default/banks/{bank_id}/consolidate` triggering observation synthesis
- [ ] **BANK-11**: Bank > List Tags — `GET /v1/default/banks/{bank_id}/tags` with optional search, limit, offset
- [ ] **BANK-12**: Bank > Clear Observations — `DELETE /v1/default/banks/{bank_id}/observations`

### Memory Resource

- [ ] **MEM-01**: Memory > Retain — `POST /v1/default/banks/{bank_id}/memories` with content (required), plus Additional Fields: timestamp, context, metadata, document_id, entities, tags, observation_scopes, strategy, async
- [ ] **MEM-02**: Memory > Recall — `POST /v1/default/banks/{bank_id}/memories/recall` with query (required), plus Additional Fields: types, budget, max_tokens, trace, query_timestamp, tags, tags_match, include options
- [ ] **MEM-03**: Memory > Reflect — `POST /v1/default/banks/{bank_id}/reflect` with query (required), plus Additional Fields: budget, max_tokens, response_schema (JSON), tags, tags_match, include.facts, include.tool_calls
- [ ] **MEM-04**: Memory > List — `GET /v1/default/banks/{bank_id}/memories/list` with optional type, search, limit, offset
- [ ] **MEM-05**: Memory > Get — `GET /v1/default/banks/{bank_id}/memories/{memory_id}`
- [ ] **MEM-06**: Memory > Clear — `DELETE /v1/default/banks/{bank_id}/memories` with optional type filter
- [ ] **MEM-07**: Memory > Clear Observations — `DELETE /v1/default/banks/{bank_id}/memories/{memory_id}/observations`

### Directive Resource

- [ ] **DIR-01**: Directive > Create — `POST /v1/default/banks/{bank_id}/directives` with name, content (required), plus Additional Fields: priority, is_active, tags
- [ ] **DIR-02**: Directive > List — `GET /v1/default/banks/{bank_id}/directives`
- [ ] **DIR-03**: Directive > Get — `GET /v1/default/banks/{bank_id}/directives/{directive_id}`
- [ ] **DIR-04**: Directive > Update — `PATCH /v1/default/banks/{bank_id}/directives/{directive_id}` with all fields optional
- [ ] **DIR-05**: Directive > Delete — `DELETE /v1/default/banks/{bank_id}/directives/{directive_id}`

### Mental Model Resource

- [ ] **MM-01**: Mental Model > Create — `POST /v1/default/banks/{bank_id}/mental-models` with name, source_query (required), plus Additional Fields: id, tags, max_tokens, trigger config
- [ ] **MM-02**: Mental Model > List — `GET /v1/default/banks/{bank_id}/mental-models`
- [ ] **MM-03**: Mental Model > Get — `GET /v1/default/banks/{bank_id}/mental-models/{mental_model_id}`
- [ ] **MM-04**: Mental Model > Update — `PATCH /v1/default/banks/{bank_id}/mental-models/{mental_model_id}` with all fields optional
- [ ] **MM-05**: Mental Model > Delete — `DELETE /v1/default/banks/{bank_id}/mental-models/{mental_model_id}`
- [ ] **MM-06**: Mental Model > Get History — `GET /v1/default/banks/{bank_id}/mental-models/{mental_model_id}/history`
- [ ] **MM-07**: Mental Model > Refresh — `POST /v1/default/banks/{bank_id}/mental-models/{mental_model_id}/refresh`

### Document Resource

- [ ] **DOC-01**: Document > List — `GET /v1/default/banks/{bank_id}/documents` with optional search, tags, tags_match, limit, offset
- [ ] **DOC-02**: Document > Get — `GET /v1/default/banks/{bank_id}/documents/{document_id}`
- [ ] **DOC-03**: Document > Update Tags — `PATCH /v1/default/banks/{bank_id}/documents/{document_id}` with tags
- [ ] **DOC-04**: Document > Delete — `DELETE /v1/default/banks/{bank_id}/documents/{document_id}`

### Entity Resource

- [ ] **ENT-01**: Entity > List — `GET /v1/default/banks/{bank_id}/entities` with limit, offset
- [ ] **ENT-02**: Entity > Get — `GET /v1/default/banks/{bank_id}/entities/{entity_id}`

### Operation Resource

- [ ] **OPS-01**: Operation > List — `GET /v1/default/banks/{bank_id}/operations`
- [ ] **OPS-02**: Operation > Get — `GET /v1/default/banks/{bank_id}/operations/{operation_id}`
- [ ] **OPS-03**: Operation > Cancel — `DELETE /v1/default/banks/{bank_id}/operations/{operation_id}`
- [ ] **OPS-04**: Operation > Retry — `POST /v1/default/banks/{bank_id}/operations/{operation_id}/retry`

### Webhook Resource

- [ ] **WH-01**: Webhook > Create — `POST /v1/default/banks/{bank_id}/webhooks` with url (required), plus Additional Fields: secret, event_types, enabled, http_config
- [ ] **WH-02**: Webhook > List — `GET /v1/default/banks/{bank_id}/webhooks`
- [ ] **WH-03**: Webhook > Update — `PATCH /v1/default/banks/{bank_id}/webhooks/{webhook_id}` with all fields optional
- [ ] **WH-04**: Webhook > Delete — `DELETE /v1/default/banks/{bank_id}/webhooks/{webhook_id}`
- [ ] **WH-05**: Webhook > List Deliveries — `GET /v1/default/banks/{bank_id}/webhooks/{webhook_id}/deliveries`

### Node UX

- [x] **UX-01**: Resource dropdown groups operations logically (Bank, Memory, Directive, Mental Model, Document, Entity, Operation, Webhook)
- [x] **UX-02**: Required fields shown upfront; optional fields in "Additional Fields" collection per operation
- [ ] **UX-03**: All operations return raw JSON response from the API
- [ ] **UX-04**: Error handling uses `continueOnFail()` pattern with `NodeApiError` for every operation
- [ ] **UX-05**: Multi-item support — node processes all input items in a loop

### Documentation

- [ ] **DOC-R01**: README with install instructions (npm install in n8n custom extensions directory)
- [ ] **DOC-R02**: README with credential setup instructions (API key + base URL)
- [ ] **DOC-R03**: README with one usage example per resource (Bank, Memory, Directive, Mental Model, Document, Entity, Operation, Webhook)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### File Operations

- **FILE-01**: File upload via multipart/form-data retain endpoint
- **FILE-02**: Binary data handling for file input from n8n

### Advanced Features

- **ADV-01**: Tag groups (compound boolean tag filters) for recall/reflect
- **ADV-02**: Observation history per memory unit
- **ADV-03**: Recover failed consolidation endpoint
- **ADV-04**: Memory graph data retrieval
- **ADV-05**: Chunk detail retrieval

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Monitoring endpoints (health/version/metrics) | Infrastructure concerns, not workflow logic |
| Deprecated API fields in UI | Maintenance liability; current alternatives exist |
| Regenerate entity observations | Explicitly deprecated in API |
| Declarative node style | Programmatic chosen for flexibility with complex request bodies |
| n8n Trigger node | Hindsight is request/response; webhooks are managed via regular node |
| Tests | Not required for v1 per user spec |
| n8n Cloud publishing | Community install only for now |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 | Phase 1 | Complete |
| SETUP-02 | Phase 1 | Complete |
| SETUP-03 | Phase 1 | Complete |
| SETUP-04 | Phase 1 | Complete |
| CRED-01 | Phase 2 | Complete |
| CRED-02 | Phase 2 | Complete |
| CRED-03 | Phase 2 | Complete |
| TRANS-01 | Phase 2 | Complete |
| TRANS-02 | Phase 2 | Complete |
| BANK-01 | Phase 3 | Complete |
| BANK-02 | Phase 3 | Complete |
| BANK-03 | Phase 3 | Complete |
| BANK-04 | Phase 3 | Complete |
| BANK-05 | Phase 3 | Complete |
| UX-01 | Phase 3 | Complete |
| UX-02 | Phase 3 | Complete |
| UX-03 | Phase 3 | Pending |
| UX-04 | Phase 3 | Pending |
| UX-05 | Phase 3 | Pending |
| MEM-01 | Phase 4 | Pending |
| MEM-02 | Phase 4 | Pending |
| MEM-03 | Phase 4 | Pending |
| BANK-06 | Phase 5 | Pending |
| BANK-07 | Phase 5 | Pending |
| BANK-08 | Phase 5 | Pending |
| BANK-09 | Phase 5 | Pending |
| BANK-10 | Phase 6 | Pending |
| BANK-11 | Phase 6 | Pending |
| BANK-12 | Phase 6 | Pending |
| MEM-04 | Phase 6 | Pending |
| MEM-05 | Phase 6 | Pending |
| MEM-06 | Phase 6 | Pending |
| MEM-07 | Phase 6 | Pending |
| DIR-01 | Phase 7 | Pending |
| DIR-02 | Phase 7 | Pending |
| DIR-03 | Phase 7 | Pending |
| DIR-04 | Phase 7 | Pending |
| DIR-05 | Phase 7 | Pending |
| MM-01 | Phase 8 | Pending |
| MM-02 | Phase 8 | Pending |
| MM-03 | Phase 8 | Pending |
| MM-04 | Phase 8 | Pending |
| MM-05 | Phase 8 | Pending |
| MM-06 | Phase 8 | Pending |
| MM-07 | Phase 8 | Pending |
| DOC-01 | Phase 9 | Pending |
| DOC-02 | Phase 9 | Pending |
| DOC-03 | Phase 9 | Pending |
| DOC-04 | Phase 9 | Pending |
| ENT-01 | Phase 9 | Pending |
| ENT-02 | Phase 9 | Pending |
| OPS-01 | Phase 9 | Pending |
| OPS-02 | Phase 9 | Pending |
| OPS-03 | Phase 9 | Pending |
| OPS-04 | Phase 9 | Pending |
| WH-01 | Phase 10 | Pending |
| WH-02 | Phase 10 | Pending |
| WH-03 | Phase 10 | Pending |
| WH-04 | Phase 10 | Pending |
| WH-05 | Phase 10 | Pending |
| DOC-R01 | Phase 10 | Pending |
| DOC-R02 | Phase 10 | Pending |
| DOC-R03 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 63 total
- Mapped to phases: 63
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation (fine granularity, 10 phases)*
