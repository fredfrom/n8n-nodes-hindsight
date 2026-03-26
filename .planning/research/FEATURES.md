# Feature Landscape

**Domain:** n8n community node wrapping Hindsight AI Memory API
**Researched:** 2026-03-26
**API Version:** 0.4.20
**Source:** OpenAPI spec at https://hindsight.vectorize.io/openapi.json (HIGH confidence)

---

## Authentication

**Mechanism:** Optional `Authorization` header on every endpoint.

- Header name: `authorization` (lowercase in OpenAPI spec)
- Format: Bearer token string (e.g., `Authorization: Bearer <api_key>`)
- Marked `required: false` in the spec -- self-hosted deployments may not require auth; Hindsight Cloud does
- No formal OpenAPI `securitySchemes` defined; auth is handled per-endpoint as an optional header parameter

**n8n credential implementation:** API Key credential type with:
- `apiKey` (string, required) -- the bearer token value
- `baseUrl` (string, required, default: `http://localhost:8888`) -- configurable base URL

The node should send `Authorization: Bearer {apiKey}` on every request. If apiKey is empty/blank, omit the header (supports no-auth self-hosted mode).

---

## Complete API Endpoint Inventory

All paths are prefixed with base URL. The `{bank_id}` is always a path parameter (string, required).

### Monitoring (3 endpoints) -- NOT for n8n node

| Method | Path | Summary |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/version` | API version + feature flags |
| GET | `/metrics` | Prometheus metrics |

### Memory Operations (8 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 1 | POST | `/v1/default/banks/{bank_id}/memories` | **Retain** -- store memories |
| 2 | POST | `/v1/default/banks/{bank_id}/memories/recall` | **Recall** -- search memories |
| 3 | POST | `/v1/default/banks/{bank_id}/reflect` | **Reflect** -- generate answer from memories |
| 4 | GET | `/v1/default/banks/{bank_id}/memories/list` | List memory units |
| 5 | GET | `/v1/default/banks/{bank_id}/memories/{memory_id}` | Get single memory unit |
| 6 | GET | `/v1/default/banks/{bank_id}/memories/{memory_id}/history` | Get observation history for memory |
| 7 | DELETE | `/v1/default/banks/{bank_id}/memories` | Clear all memories in bank |
| 8 | DELETE | `/v1/default/banks/{bank_id}/memories/{memory_id}/observations` | Clear observations for a memory |

### Bank Management (12 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 9 | GET | `/v1/default/banks` | List all banks |
| 10 | PUT | `/v1/default/banks/{bank_id}` | Create or update bank |
| 11 | PATCH | `/v1/default/banks/{bank_id}` | Partial update bank |
| 12 | DELETE | `/v1/default/banks/{bank_id}` | Delete bank (destructive) |
| 13 | GET | `/v1/default/banks/{bank_id}/profile` | Get bank profile |
| 14 | PUT | `/v1/default/banks/{bank_id}/profile` | Update disposition |
| 15 | GET | `/v1/default/banks/{bank_id}/config` | Get resolved config |
| 16 | PATCH | `/v1/default/banks/{bank_id}/config` | Update config overrides |
| 17 | DELETE | `/v1/default/banks/{bank_id}/config` | Reset config to defaults |
| 18 | GET | `/v1/default/banks/{bank_id}/stats` | Get bank statistics |
| 19 | POST | `/v1/default/banks/{bank_id}/consolidate` | Trigger consolidation |
| 20 | POST | `/v1/default/banks/{bank_id}/consolidation/recover` | Recover failed consolidation |

### Bank Sub-item: Observations (1 endpoint)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 21 | DELETE | `/v1/default/banks/{bank_id}/observations` | Clear all observations |

### Bank Sub-item: Tags (1 endpoint)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 22 | GET | `/v1/default/banks/{bank_id}/tags` | List tags with counts |

### Directives (5 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 23 | GET | `/v1/default/banks/{bank_id}/directives` | List directives |
| 24 | POST | `/v1/default/banks/{bank_id}/directives` | Create directive |
| 25 | GET | `/v1/default/banks/{bank_id}/directives/{directive_id}` | Get directive |
| 26 | PATCH | `/v1/default/banks/{bank_id}/directives/{directive_id}` | Update directive |
| 27 | DELETE | `/v1/default/banks/{bank_id}/directives/{directive_id}` | Delete directive |

### Mental Models (7 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 28 | GET | `/v1/default/banks/{bank_id}/mental-models` | List mental models |
| 29 | POST | `/v1/default/banks/{bank_id}/mental-models` | Create mental model |
| 30 | GET | `/v1/default/banks/{bank_id}/mental-models/{mental_model_id}` | Get mental model |
| 31 | PATCH | `/v1/default/banks/{bank_id}/mental-models/{mental_model_id}` | Update mental model |
| 32 | DELETE | `/v1/default/banks/{bank_id}/mental-models/{mental_model_id}` | Delete mental model |
| 33 | GET | `/v1/default/banks/{bank_id}/mental-models/{mental_model_id}/history` | Get history |
| 34 | POST | `/v1/default/banks/{bank_id}/mental-models/{mental_model_id}/refresh` | Refresh mental model |

### Documents (4 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 35 | GET | `/v1/default/banks/{bank_id}/documents` | List documents |
| 36 | GET | `/v1/default/banks/{bank_id}/documents/{document_id}` | Get document details |
| 37 | PATCH | `/v1/default/banks/{bank_id}/documents/{document_id}` | Update document tags |
| 38 | DELETE | `/v1/default/banks/{bank_id}/documents/{document_id}` | Delete document + memories |

### Entities (3 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 39 | GET | `/v1/default/banks/{bank_id}/entities` | List entities |
| 40 | GET | `/v1/default/banks/{bank_id}/entities/{entity_id}` | Get entity details |
| 41 | POST | `/v1/default/banks/{bank_id}/entities/{entity_id}/regenerate` | Regenerate entity observations **(DEPRECATED)** |

### Chunks (1 endpoint)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 42 | GET | `/v1/default/chunks/{chunk_id}` | Get chunk details |

### Graph (1 endpoint)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 43 | GET | `/v1/default/banks/{bank_id}/graph` | Get memory graph data |

### Operations (4 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 44 | GET | `/v1/default/banks/{bank_id}/operations` | List async operations |
| 45 | GET | `/v1/default/banks/{bank_id}/operations/{operation_id}` | Get operation status |
| 46 | DELETE | `/v1/default/banks/{bank_id}/operations/{operation_id}` | Cancel pending operation |
| 47 | POST | `/v1/default/banks/{bank_id}/operations/{operation_id}/retry` | Retry failed operation |

### Webhooks (5 endpoints)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 48 | POST | `/v1/default/banks/{bank_id}/webhooks` | Register webhook |
| 49 | GET | `/v1/default/banks/{bank_id}/webhooks` | List webhooks |
| 50 | PATCH | `/v1/default/banks/{bank_id}/webhooks/{webhook_id}` | Update webhook |
| 51 | DELETE | `/v1/default/banks/{bank_id}/webhooks/{webhook_id}` | Delete webhook |
| 52 | GET | `/v1/default/banks/{bank_id}/webhooks/{webhook_id}/deliveries` | List deliveries |

### Files (1 endpoint)

| # | Method | Path | Summary |
|---|--------|------|---------|
| 53 | POST | `/v1/default/banks/{bank_id}/files/retain` | Upload files as memories (multipart) |

**Total: 53 endpoints** (50 excluding monitoring)

---

## Detailed Endpoint Specifications

### 1. Retain Memories

```
POST /v1/default/banks/{bank_id}/memories
```

**Request Body (`RetainRequest`):**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `items` | `MemoryItem[]` | **YES** | -- | Array of memory items to store |
| `async` | boolean | no | `false` | Process asynchronously in background |
| ~~`document_tags`~~ | string[] | no | -- | DEPRECATED: use item-level tags |

**MemoryItem fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `content` | string | **YES** | -- | Raw text to analyze and store |
| `timestamp` | string (ISO 8601) or `"unset"` or null | no | now | When content occurred. `"unset"` for timeless content |
| `context` | string or null | no | null | Source/situation label (e.g., "team meeting", "slack") |
| `metadata` | `Record<string, string>` or null | no | null | Arbitrary key-value string pairs |
| `document_id` | string or null | no | null | Caller-supplied ID for upsert idempotency |
| `entities` | `EntityInput[]` or null | no | null | Guaranteed entities with optional types |
| `tags` | string[] or null | no | null | Visibility scoping filters |
| `observation_scopes` | `"per_tag"` / `"combined"` / `"all_combinations"` / string[][] or null | no | `"combined"` | Controls observation consolidation scoping |
| `strategy` | string or null | no | null | Named retain strategy override |

**EntityInput:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | **YES** | Entity name/text |
| `type` | string or null | no | Entity type (e.g., "PERSON", "ORG", "CONCEPT") |

**Response (`RetainResponse`):**

| Field | Type | Always Present | Description |
|-------|------|----------------|-------------|
| `success` | boolean | yes | Whether operation succeeded |
| `bank_id` | string | yes | Bank identifier |
| `items_count` | integer | yes | Number of items processed |
| `async` | boolean | yes | Whether processed asynchronously |
| `operation_id` | string or null | no | Tracking ID (only when async=true) |
| `operation_ids` | string[] or null | no | Multiple IDs when mixed strategies |
| `usage` | `TokenUsage` or null | no | Token metrics (sync only) |

---

### 2. Recall Memories

```
POST /v1/default/banks/{bank_id}/memories/recall
```

**Request Body (`RecallRequest`):**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | **YES** | -- | Natural language search query |
| `types` | string[] | no | `["world","experience"]` | Fact types: `"world"`, `"experience"`, `"observation"` |
| `budget` | `"low"` / `"mid"` / `"high"` | no | `"mid"` | Retrieval depth |
| `max_tokens` | integer | no | `4096` | Max tokens for returned facts |
| `trace` | boolean | no | `false` | Enable debug trace |
| `query_timestamp` | string (ISO 8601) | no | null | Anchor for relative temporal expressions |
| `include` | `IncludeOptions` | no | `{}` | What additional data to include |
| `tags` | string[] | no | null | Filter by tags |
| `tags_match` | `"any"` / `"all"` / `"any_strict"` / `"all_strict"` | no | `"any"` | Tag matching mode |
| `tag_groups` | TagGroup[] | no | null | Compound boolean tag filters |

**IncludeOptions:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `entities` | `{max_tokens: int}` or null | `{max_tokens: 500}` | Entity observations (included by default) |
| `chunks` | `{max_tokens: int}` or null | null (disabled) | Raw source chunks |
| `source_facts` | `{max_tokens: int, max_tokens_per_observation: int}` or null | null (disabled) | Source facts for observations |

**Response (`RecallResponse`):**

| Field | Type | Always Present | Description |
|-------|------|----------------|-------------|
| `results` | `RecallResult[]` | yes | Array of matching memories |
| `trace` | object or null | no | Debug trace data |
| `entities` | `Record<string, EntityStateResponse>` or null | no | Entity states |
| `chunks` | `Record<string, ChunkData>` or null | no | Source chunks |
| `source_facts` | `Record<string, RecallResult>` or null | no | Source facts for observations |

**RecallResult:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Memory ID |
| `text` | string | Memory text |
| `type` | string or null | `"world"` / `"experience"` / `"observation"` |
| `entities` | string[] or null | Associated entities |
| `context` | string or null | Source context |
| `occurred_start` | string or null | Event start time |
| `occurred_end` | string or null | Event end time |
| `mentioned_at` | string or null | When mentioned |
| `document_id` | string or null | Source document |
| `metadata` | `Record<string, string>` or null | Custom metadata |
| `tags` | string[] | Associated tags |
| `chunk_id` | string or null | Source chunk reference |
| `source_fact_ids` | string[] or null | For observation-type results |

---

### 3. Reflect

```
POST /v1/default/banks/{bank_id}/reflect
```

**Request Body (`ReflectRequest`):**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | **YES** | -- | Question or prompt to reflect on |
| `budget` | `"low"` / `"mid"` / `"high"` | no | `"low"` | Search thoroughness |
| `max_tokens` | integer | no | `4096` | Response length limit |
| `response_schema` | JSON Schema object | no | null | For structured output |
| `tags` | string[] | no | null | Filter accessible memories |
| `tags_match` | `"any"` / `"all"` / `"any_strict"` / `"all_strict"` | no | `"any"` | Tag matching mode |
| `tag_groups` | TagGroup[] | no | null | Compound tag filters |
| `include.facts` | `{}` or null | no | null | Include evidence in response |
| `include.tool_calls` | `{output?: boolean}` or null | no | null | Include execution trace |
| ~~`context`~~ | string | no | null | DEPRECATED: append to query instead |

**Response (`ReflectResponse`):**

| Field | Type | Always Present | Description |
|-------|------|----------------|-------------|
| `text` | string | yes | Markdown-formatted answer |
| `based_on` | `ReflectBasedOn` or null | no | Evidence (when include.facts set) |
| `structured_output` | object or null | no | Parsed output (when response_schema provided) |
| `usage` | `TokenUsage` or null | no | Token metrics |
| `trace` | `ReflectTrace` or null | no | Tool/LLM call trace |

**ReflectBasedOn:**

| Field | Type | Description |
|-------|------|-------------|
| `memories` | `{id, text, type}[]` | Memory facts used |
| `mental_models` | `{id, text}[]` | Mental models used |
| `directives` | `{id, name, content}[]` | Directives applied |

---

### 4. List Banks

```
GET /v1/default/banks
```

No query parameters (aside from optional `authorization` header).

**Response (`BankListResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `banks` | `BankListItem[]` | Array of bank summaries |

**BankListItem:**

| Field | Type | Description |
|-------|------|-------------|
| `bank_id` | string (required) | Bank identifier |
| `name` | string or null | Display name |
| `disposition` | `DispositionTraits` (required) | Personality traits |
| `mission` | string or null | Bank mission |
| `created_at` | string or null | Creation timestamp |
| `updated_at` | string or null | Last update |

---

### 5. Create or Update Bank

```
PUT /v1/default/banks/{bank_id}
```

**Request Body (`CreateBankRequest`) -- all fields optional:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string or null | Display label (deprecated but functional) |
| `mission` | string or null | Agent mission statement |
| ~~`disposition`~~ | `DispositionTraits` or null | DEPRECATED: use config API |
| ~~`disposition_skepticism`~~ | integer 1-5 or null | DEPRECATED: use config API |
| ~~`disposition_literalism`~~ | integer 1-5 or null | DEPRECATED: use config API |
| ~~`disposition_empathy`~~ | integer 1-5 or null | DEPRECATED: use config API |
| ~~`background`~~ | string or null | DEPRECATED: use mission |

**Response:** `BankProfileResponse` (see below)

---

### 6. Partial Update Bank

```
PATCH /v1/default/banks/{bank_id}
```

Same request body as Create (only provided fields updated). Response: `BankProfileResponse`.

---

### 7. Delete Bank

```
DELETE /v1/default/banks/{bank_id}
```

No request body. Destructive -- deletes all memories, entities, documents, profile.

**Response:** `DeleteResponse` (`{success, message?, deleted_count?}`)

---

### 8. Get Bank Profile

```
GET /v1/default/banks/{bank_id}/profile
```

**Response (`BankProfileResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `bank_id` | string | Identifier |
| `name` | string | Display name |
| `disposition` | `DispositionTraits` | `{skepticism: 1-5, literalism: 1-5, empathy: 1-5}` |
| `mission` | string | Mission statement |
| ~~`background`~~ | string or null | DEPRECATED |

---

### 9. Update Bank Disposition

```
PUT /v1/default/banks/{bank_id}/profile
```

**Request Body (`UpdateDispositionRequest`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `disposition` | `DispositionTraits` | **YES** | `{skepticism: 1-5, literalism: 1-5, empathy: 1-5}` |

**Response:** `BankProfileResponse`

---

### 10. Get Bank Config

```
GET /v1/default/banks/{bank_id}/config
```

**Response (`BankConfigResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `bank_id` | string | Bank identifier |
| `config` | object | Fully resolved config (all overrides applied) |
| `overrides` | object | Bank-specific overrides only |

---

### 11. Update Bank Config

```
PATCH /v1/default/banks/{bank_id}/config
```

**Request Body (`BankConfigUpdate`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `updates` | object | **YES** | Key-value config overrides |

**Known configurable keys (from docs):**

| Key | Type | Description |
|-----|------|-------------|
| `retain_chunk_size` | integer | Chunk size for retention |
| `retain_extraction_mode` | `"concise"` / `"verbose"` / `"custom"` | Extraction verbosity |
| `retain_custom_instructions` | string | Custom extraction instructions |
| `retain_mission` | string | Fact extraction focus |
| `enable_observations` | boolean | Enable observation consolidation |
| `observations_mission` | string | What observations synthesize |
| `reflect_mission` | string | Global reasoning framing |
| `disposition_skepticism` | integer 1-5 | Skeptical vs trusting |
| `disposition_literalism` | integer 1-5 | Literal vs flexible |
| `disposition_empathy` | integer 1-5 | Empathetic vs detached |
| `entity_labels` | string[] | Allowed entity labels |
| `entities_allow_free_form` | boolean | Allow unlabeled entities |
| `consolidation_llm_batch_size` | integer | Batch size for consolidation |
| `mcp_enabled_tools` | string[] | MCP tool access control |
| `llm_model` | string | LLM model name |
| `llm_provider` | string | LLM provider |

**Response:** `BankConfigResponse`

---

### 12. Reset Bank Config

```
DELETE /v1/default/banks/{bank_id}/config
```

Resets to server defaults. **Response:** `BankConfigResponse`

---

### 13. Get Bank Stats

```
GET /v1/default/banks/{bank_id}/stats
```

**Response (`BankStatsResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `bank_id` | string | Bank identifier |
| `total_nodes` | integer | Total memory nodes |
| `total_links` | integer | Total graph links |
| `total_documents` | integer | Total documents |
| `nodes_by_fact_type` | `Record<string, int>` | Nodes grouped by type |
| `links_by_link_type` | `Record<string, int>` | Links by type |
| `links_by_fact_type` | `Record<string, int>` | Links by fact type |
| `links_breakdown` | `Record<string, Record<string, int>>` | Detailed breakdown |
| `pending_operations` | integer | Pending async ops |
| `failed_operations` | integer | Failed async ops |

---

### 14. Trigger Consolidation

```
POST /v1/default/banks/{bank_id}/consolidate
```

No request body.

**Response (`ConsolidationResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `operation_id` | string | Async operation ID |
| `deduplicated` | boolean | True if existing pending task reused |

---

### 15. Recover Failed Consolidation

```
POST /v1/default/banks/{bank_id}/consolidation/recover
```

No request body.

**Response:** `{retried_count: integer}`

---

### 16. Clear Observations

```
DELETE /v1/default/banks/{bank_id}/observations
```

**Response:** `DeleteResponse`

---

### 17. List Tags

```
GET /v1/default/banks/{bank_id}/tags
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `q` | string | no | null | Substring search filter |
| `limit` | integer | no | 100 | Page size |
| `offset` | integer | no | 0 | Pagination offset |

**Response (`ListTagsResponse`):** `{items: [{tag: string, count: integer}], total, limit, offset}`

---

### 18. List Memory Units

```
GET /v1/default/banks/{bank_id}/memories/list
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | no | null | Filter: `"world"`, `"experience"`, `"observation"` |
| `q` | string | no | null | Text search |
| `limit` | integer | no | 100 | Page size |
| `offset` | integer | no | 0 | Offset |

**Response (`ListMemoryUnitsResponse`):** `{items: object[], total, limit, offset}`

---

### 19. Get Memory Unit

```
GET /v1/default/banks/{bank_id}/memories/{memory_id}
```

**Response:** Memory unit object with `id`, `text`, `type`, `entities`, `context`, dates, etc.

---

### 20. Get Observation History

```
GET /v1/default/banks/{bank_id}/memories/{memory_id}/history
```

**Response:** History array with timestamps and content changes.

---

### 21. Clear Memories

```
DELETE /v1/default/banks/{bank_id}/memories
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | no | null | Filter: `"world"`, `"experience"`, `"opinion"` |

**Response:** `DeleteResponse`. Destructive, cannot be undone. Bank profile preserved.

---

### 22. Clear Memory Observations

```
DELETE /v1/default/banks/{bank_id}/memories/{memory_id}/observations
```

**Response:** `DeleteResponse`

---

### 23-27. Directives CRUD

**Create:**
```
POST /v1/default/banks/{bank_id}/directives
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | **YES** | -- | Human-readable name |
| `content` | string | **YES** | -- | Directive text injected into prompts |
| `priority` | integer | no | 0 | Higher = injected first |
| `is_active` | boolean | no | true | Whether active |
| `tags` | string[] | no | `[]` | Filter tags |

**Response (`DirectiveResponse`):** `{id, bank_id, name, content, priority, is_active, tags, created_at, updated_at}`

**List:** `GET /v1/default/banks/{bank_id}/directives` -- returns array of DirectiveResponse

**Get:** `GET /v1/default/banks/{bank_id}/directives/{directive_id}`

**Update:**
```
PATCH /v1/default/banks/{bank_id}/directives/{directive_id}
```
All fields optional: `name`, `content`, `priority`, `is_active`, `tags`.

**Delete:** `DELETE /v1/default/banks/{bank_id}/directives/{directive_id}`

---

### 28-34. Mental Models CRUD + Refresh

**Create:**
```
POST /v1/default/banks/{bank_id}/mental-models
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | **YES** | -- | Human-readable name |
| `source_query` | string | **YES** | -- | Query to generate content |
| `id` | string | no | auto-generated | Custom alphanumeric lowercase ID |
| `tags` | string[] | no | `[]` | Scoped visibility tags |
| `max_tokens` | integer (256-8192) | no | 2048 | Content length limit |
| `trigger` | `MentalModelTrigger` | no | `{}` | Auto-refresh config |

**MentalModelTrigger:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `refresh_after_consolidation` | boolean | false | Auto-refresh after consolidation |
| `fact_types` | `("world"/"experience"/"observation")[]` or null | null (all) | Filter fact types during reflect |
| `exclude_mental_models` | boolean | false | Exclude other mental models during refresh |

**Response (`MentalModelResponse`):** `{id, bank_id, name, source_query, content, tags, max_tokens, trigger, last_refreshed_at, created_at}`

**List:** `GET /v1/default/banks/{bank_id}/mental-models`

**Get:** `GET /v1/default/banks/{bank_id}/mental-models/{mental_model_id}`

**Update:**
```
PATCH /v1/default/banks/{bank_id}/mental-models/{mental_model_id}
```
All fields optional: `name`, `source_query`, `max_tokens`, `tags`, `trigger`.

**Delete:** `DELETE /v1/default/banks/{bank_id}/mental-models/{mental_model_id}`

**Get History:** `GET /v1/default/banks/{bank_id}/mental-models/{mental_model_id}/history`

**Refresh:**
```
POST /v1/default/banks/{bank_id}/mental-models/{mental_model_id}/refresh
```
No request body. Re-runs the source query.

---

### 35-38. Documents

**List:**
```
GET /v1/default/banks/{bank_id}/documents
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `q` | string | no | null | Substring match on document ID |
| `tags` | string[] | no | null | Filter by tags |
| `tags_match` | `"any"/"all"/"any_strict"/"all_strict"` | no | `"any_strict"` | Tag matching mode |
| `limit` | integer | no | 100 | Page size |
| `offset` | integer | no | 0 | Offset |

**Response:** `{items: object[], total, limit, offset}`

**Get:** `GET /v1/default/banks/{bank_id}/documents/{document_id}`

**Response (`DocumentResponse`):** `{id, bank_id, original_text, content_hash, created_at, updated_at, memory_unit_count, tags}`

**Update:**
```
PATCH /v1/default/banks/{bank_id}/documents/{document_id}
```

| Field | Type | Description |
|-------|------|-------------|
| `tags` | string[] or null | New tags (triggers observation re-consolidation) |

**Response:** `{success: true}`

**Delete:** `DELETE /v1/default/banks/{bank_id}/documents/{document_id}`

**Response:** `{success, message, document_id, memory_units_deleted}`

---

### 39-40. Entities

**List:**
```
GET /v1/default/banks/{bank_id}/entities
```

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `limit` | integer | no | 100 |
| `offset` | integer | no | 0 |

**Response (`EntityListResponse`):** `{items: EntityListItem[], total, limit, offset}`

**EntityListItem:** `{id, canonical_name, mention_count, first_seen, last_seen}`

**Get:**
```
GET /v1/default/banks/{bank_id}/entities/{entity_id}
```

**Response (`EntityDetailResponse`):** `{id, canonical_name, mention_count, first_seen, last_seen, metadata, observations: EntityObservationResponse[]}`

---

### 42. Get Chunk

```
GET /v1/default/chunks/{chunk_id}
```

Note: path does NOT include `banks/{bank_id}`.

**Response:** `ChunkData` object.

---

### 43. Memory Graph

```
GET /v1/default/banks/{bank_id}/graph
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | no | null | Filter: `"world"`, `"experience"`, `"observation"` |
| `limit` | integer | no | 1000 | Max nodes |
| `q` | string | no | null | Text search |
| `tags` | string[] | no | null | Tag filter |
| `tags_match` | string | no | `"all_strict"` | Tag matching |

**Response:** `GraphDataResponse` -- graph nodes and edges for visualization.

---

### 44-47. Operations

**List:**
```
GET /v1/default/banks/{bank_id}/operations
```

**Response:** Array of `OperationResponse`.

**OperationResponse:** `{id, task_type, items_count, document_id?, created_at, status, error_message?}`

Status values: `"pending"`, `"completed"`, `"failed"`

**Get:** `GET /v1/default/banks/{bank_id}/operations/{operation_id}`

**Cancel:** `DELETE /v1/default/banks/{bank_id}/operations/{operation_id}`

**Retry:** `POST /v1/default/banks/{bank_id}/operations/{operation_id}/retry`

Response: `{success, message, operation_id}`

---

### 48-52. Webhooks

**Create:**
```
POST /v1/default/banks/{bank_id}/webhooks
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `url` | string | **YES** | -- | Delivery endpoint URL |
| `secret` | string | no | null | HMAC-SHA256 signing secret |
| `event_types` | string[] | no | `["consolidation.completed"]` | Event types to deliver |
| `enabled` | boolean | no | true | Whether active |
| `http_config` | WebhookHttpConfig | no | default | HTTP delivery settings |

**WebhookHttpConfig:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `method` | `"GET"` / `"POST"` | `"POST"` | HTTP method |
| `timeout_seconds` | integer | 30 | Request timeout |
| `headers` | `Record<string, string>` | `{}` | Custom headers |
| `params` | `Record<string, string>` | `{}` | Custom query params |

**Event types:** `"consolidation.completed"`, `"retain.completed"`

**Response (`WebhookResponse`):** `{id, bank_id, url, secret (redacted), event_types, enabled, http_config, created_at, updated_at}`

**List:** `GET /v1/default/banks/{bank_id}/webhooks`

**Update:** `PATCH /v1/default/banks/{bank_id}/webhooks/{webhook_id}` (all fields optional)

**Delete:** `DELETE /v1/default/banks/{bank_id}/webhooks/{webhook_id}`

**List Deliveries:**
```
GET /v1/default/banks/{bank_id}/webhooks/{webhook_id}/deliveries
```

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `limit` | integer | no | (server default) |
| `cursor` | string | no | null |

---

### 53. File Retain (Upload)

```
POST /v1/default/banks/{bank_id}/files/retain
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | binary[] | **YES** | Files to upload (PDF, DOCX, PPTX, XLSX, images, audio) |
| `request` | string (JSON) | **YES** | JSON string with FileRetainRequest model |

Always processes asynchronously. Returns `{operation_ids: string[]}`.

---

## Common Shared Types

### TokenUsage

```json
{
  "input_tokens": 1500,
  "output_tokens": 500,
  "total_tokens": 2000
}
```

### Budget (enum)

`"low"` | `"mid"` | `"high"`

### DispositionTraits

```json
{
  "skepticism": 3,    // 1=trusting, 5=skeptical
  "literalism": 3,    // 1=flexible, 5=literal
  "empathy": 3        // 1=detached, 5=empathetic
}
```

### DeleteResponse

```json
{
  "success": true,
  "message": "Deleted successfully",
  "deleted_count": 10
}
```

### TagGroup (compound filter)

Recursive boolean tree: `TagGroupLeaf({tags, match})`, `TagGroupAnd({and: [...]})`, `TagGroupOr({or: [...]})`, `TagGroupNot({not: ...})`

---

## Table Stakes

Features users expect. Missing = node feels incomplete.

| Feature | Why Expected | Complexity | n8n Operations |
|---------|--------------|------------|----------------|
| Retain memories | Core purpose of Hindsight | Medium | Memory > Retain |
| Recall memories | Core retrieval operation | Medium | Memory > Recall |
| Reflect on memories | Core reasoning operation | Medium | Memory > Reflect |
| Create/update bank | Must manage banks to use anything | Low | Bank > Create/Update |
| List banks | Discovery/selection | Low | Bank > List |
| Delete bank | Lifecycle management | Low | Bank > Delete |
| Get bank profile | View bank state | Low | Bank > Get Profile |
| Get bank stats | Operational visibility | Low | Bank > Get Stats |

## Differentiators

Features that add value beyond basic API wrapping.

| Feature | Value Proposition | Complexity | n8n Operations |
|---------|-------------------|------------|----------------|
| Directives CRUD | Control reasoning behavior per bank | Low | Directive > Create/List/Get/Update/Delete |
| Mental models CRUD + Refresh | Pre-computed summaries for common queries | Medium | Mental Model > Create/List/Get/Update/Delete/Refresh |
| Document management | Track/manage source documents | Low | Document > List/Get/Update/Delete |
| Entity browsing | Explore extracted entities | Low | Entity > List/Get |
| Bank config management | Fine-tune extraction and reasoning | Low | Bank Config > Get/Update/Reset |
| Update disposition | Tune personality traits | Low | Bank > Update Disposition |
| Operations monitoring | Track async retain jobs | Low | Operation > List/Get/Cancel/Retry |
| List tags | Discover available tag filters | Low | Tag > List |
| Trigger consolidation | Force observation synthesis | Low | Bank > Consolidate |
| Webhook management | Event-driven workflows | Medium | Webhook > Create/List/Update/Delete/List Deliveries |
| Structured output (reflect) | Machine-readable responses via response_schema | Low | Built into Reflect operation |
| Clear memories | Bulk cleanup | Low | Memory > Clear |
| Clear observations | Reset synthesis | Low | Memory > Clear Observations / Bank > Clear Observations |

## Anti-Features

Things to deliberately NOT expose in n8n.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| File upload (multipart) | n8n's httpRequest doesn't handle multipart/form-data well in programmatic nodes; file handling adds significant complexity; niche use case | Omit from v1. Users can pre-convert files and use Retain with content text |
| Memory graph visualization | Returns graph data for UI rendering; no value in n8n JSON context | Omit entirely |
| Chunk details (GET /chunks/{chunk_id}) | Low-level internal reference; rarely needed standalone | Omit from v1 |
| Monitoring endpoints (health/version/metrics) | Infrastructure concerns, not workflow logic | Omit entirely |
| Deprecated fields | `document_tags` on retain, `background` on bank, `context` on reflect, disposition fields on CreateBankRequest | Accept but don't surface in UI; use current alternatives |
| Regenerate entity observations | Explicitly marked DEPRECATED in API | Omit |
| Add bank background (POST .../background) | Marked DEPRECATED in API | Omit |
| Tag groups (compound boolean filters) | Extremely complex recursive tree structure; poor n8n UX. Simple `tags` + `tags_match` covers 95% of use cases | Omit from v1; revisit if users request |
| Recover failed consolidation | Admin-level operation; niche | Omit from v1 |
| Observation history (per memory) | Niche debugging use case | Omit from v1 |

## Feature Dependencies

```
Bank Create/Update  -->  ALL other operations (bank must exist)
Retain              -->  Recall, Reflect, Documents, Entities, Mental Models
Retain (async=true) -->  Operations (to track status)
Consolidation       -->  Observations exist (auto after retain, or manual trigger)
Directives          -->  Reflect (directives shape reflection output)
Mental Models       -->  Reflect (mental models inform reflection)
Webhooks            -->  External URL to receive events
```

## MVP Recommendation

### Phase 1: Core Operations (table stakes)
1. **Bank** resource: Create/Update, List, Get Profile, Get Stats, Delete
2. **Memory** resource: Retain, Recall, Reflect
3. Credential type with API key + base URL

### Phase 2: Advanced Configuration
4. **Bank Config**: Get, Update, Reset
5. **Bank Disposition**: Update
6. **Directive** resource: full CRUD
7. **Memory** extras: List, Clear

### Phase 3: Extended Features
8. **Mental Model** resource: full CRUD + Refresh
9. **Document** resource: List, Get, Update, Delete
10. **Entity** resource: List, Get
11. **Operation** resource: List, Get, Cancel, Retry
12. **Tag**: List
13. **Consolidation**: Trigger

### Phase 4: Event-Driven (if demand)
14. **Webhook** resource: full CRUD + List Deliveries

**Defer indefinitely:** File upload, graph, chunks, monitoring, deprecated endpoints.

## Sources

- [Hindsight OpenAPI Specification v0.4.20](https://hindsight.vectorize.io/openapi.json) -- PRIMARY source, HIGH confidence
- [Hindsight API Reference](https://hindsight.vectorize.io/api-reference)
- [Hindsight GitHub Repository](https://github.com/vectorize-io/hindsight)
- [Hindsight Retain Docs](https://hindsight.vectorize.io/developer/api/retain)
- [Hindsight Recall Docs](https://hindsight.vectorize.io/developer/api/recall)
- [Hindsight Reflect Docs](https://hindsight.vectorize.io/developer/api/reflect)
- [Hindsight Memory Banks Docs](https://hindsight.vectorize.io/developer/api/memory-banks)
- [Hindsight Configuration Docs](https://hindsight.vectorize.io/developer/configuration)
