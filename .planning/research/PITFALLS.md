# Domain Pitfalls

**Domain:** n8n community node wrapping a REST API (Hindsight by Vectorize.io)
**Researched:** 2026-03-26

## Critical Pitfalls

Mistakes that cause the node to not load, fail linting, or be uninstallable.

### Pitfall 1: Naming Convention Mismatches (File / Class / package.json)

**What goes wrong:** n8n requires strict alignment between the TypeScript class name, the file name, the directory name, and the path registered in `package.json`'s `n8n.nodes` array. A mismatch at any point causes the node to silently not appear in n8n after installation, or throws `TypeError: require(...).ClassName is not a constructor` at runtime.

**Why it happens:** Developers rename files or classes during refactoring without updating all references. The n8n loader resolves nodes by path, then expects the default export class name to match the file stem. The linter rule `node-filename-against-convention` and `node-dirname-against-convention` catch some of this, but not the package.json path mismatch.

**Consequences:** Node installs via npm but never appears in the n8n node picker. No error in the UI -- completely silent failure. Developers waste hours debugging.

**Prevention:**
- Establish naming once and never deviate: class `Hindsight`, file `Hindsight.node.ts`, directory `Hindsight/`, package.json path `dist/nodes/Hindsight/Hindsight.node.js`.
- Credential: class `HindsightApi`, file `HindsightApi.credentials.ts`, package.json path `dist/credentials/HindsightApi.credentials.js`.
- Run `npm run build && npm run lint` after every rename.

**Detection:** Node does not appear in n8n node picker after `npm link` or `npm run dev`. Check the n8n startup logs for loader errors.

**Phase relevance:** Phase 1 (scaffolding). Get this right at project creation and lock it down.

---

### Pitfall 2: package.json n8n Block Misconfiguration

**What goes wrong:** The `n8n` block in package.json has strict requirements enforced by ~19 dedicated linter rules. Missing or wrong values cause linter failures and can prevent n8n from loading the node.

**Why it happens:** Developers copy the starter template but forget to update default values, or miss required fields.

**Consequences:** `npm run lint` fails with community-package-json rules. If published without fixing, n8n cannot discover or load the node.

**Prevention:** The n8n block must contain:
```json
{
  "n8n": {
    "n8nNodesApiVersion": 1,
    "nodes": ["dist/nodes/Hindsight/Hindsight.node.js"],
    "credentials": ["dist/credentials/HindsightApi.credentials.js"]
  }
}
```
Additionally required in package.json:
- `"keywords"` array MUST include `"n8n-community-node-package"` (discovery keyword)
- `"license"` MUST be `"MIT"`
- `"author"` with non-empty `name` and `email`
- `"description"` must not be the default empty string
- `"repository"` URL must not be the starter template default
- `n8nNodesApiVersion` must be a number (not a string)

**Detection:** Run `npm run lint` immediately after scaffolding, before writing any node code. All community-package-json rules will flag issues.

**Phase relevance:** Phase 1 (scaffolding). First thing to validate.

---

### Pitfall 3: Missing continueOnFail Error Handling

**What goes wrong:** The `execute()` method must wrap item processing in try/catch and check `this.continueOnFail()`. Without this, a single failed API call crashes the entire workflow instead of allowing the "Continue on Error" workflow setting to work. In older versions, throwing raw errors (not `NodeApiError` or `NodeOperationError`) could crash the entire n8n instance.

**Why it happens:** Developers focus on the happy path. The linter rule `node-execute-block-missing-continue-on-fail` catches this, but only if the eslint config includes the `nodes` ruleset.

**Consequences:** Users who enable "Continue on Error" on the node find it does not work. Their workflows break on any API error. In severe cases, the n8n process itself crashes.

**Prevention:** Always use this pattern in `execute()`:
```typescript
const items = this.getInputData();
const returnData: INodeExecutionData[] = [];
for (let i = 0; i < items.length; i++) {
  try {
    // ... API call logic ...
    returnData.push({ json: responseData });
  } catch (error) {
    if (this.continueOnFail()) {
      returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
      continue;
    }
    throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
  }
}
return [returnData];
```
Key details:
- Only throw `NodeApiError`, `NodeOperationError`, or `ApplicationError` -- never raw `Error`.
- Always pass `itemIndex` to error constructors (linter rule: `node-execute-block-error-missing-item-index`).
- Always include `pairedItem` in the continue-on-fail output so n8n can track data lineage.

**Detection:** `npm run lint` flags missing continueOnFail. Manual test: enable "Continue on Error" on the node and send a request that will fail (bad bank ID, etc.).

**Phase relevance:** Phase 2 (node implementation). Must be in the execute pattern from the start.

---

### Pitfall 4: Using Deprecated this.helpers.request Instead of this.helpers.httpRequest

**What goes wrong:** The old `this.helpers.request()` was backed by `request-promise` and was removed in n8n v1.0. Using it causes runtime crashes.

**Why it happens:** Many blog posts, tutorials, and even some older community nodes still show the old API. Copy-paste from outdated examples.

**Consequences:** `this.helpers.request is not a function` at runtime. Node appears to load but crashes on execution.

**Prevention:** Always use `this.helpers.httpRequest()` which is Axios-based. Key differences:
- Uses `url` property (not `uri`)
- Returns parsed JSON by default (set `returnFullResponse: true` for headers/status)
- Pass `body` for request body (not `form` or `formData`)

For this project, use `this.helpers.httpRequestWithAuthentication('hindsightApi', options)` to automatically inject the credential's API key header.

**Detection:** TypeScript compilation will catch it if n8n type definitions are up to date. Also: test every operation at least once.

**Phase relevance:** Phase 2 (node implementation). Choose the right helper from day one.

---

### Pitfall 5: Exposing Deprecated Hindsight API Fields in UI

**What goes wrong:** The Hindsight API has many deprecated fields that still work: `disposition` fields on CreateBankRequest, `background` on bank profile, `document_tags` on retain, `context` on reflect. Exposing these in the n8n UI creates confusion and breaks when the API removes them.

**Why it happens:** Copy-pasting field lists from the OpenAPI spec without checking `deprecated: true` markers.

**Consequences:** Node breaks on API upgrade; users build workflows around deprecated params that will stop working.

**Prevention:** Filter deprecated fields during implementation:
- Use `mission` not `background` for bank description
- Use item-level `tags` not `document_tags` on retain requests
- Append context directly to `query` in reflect (don't expose separate context field)
- Use config API (`PATCH .../config`) for disposition settings instead of CreateBankRequest fields
- Do not expose the deprecated `POST .../background` endpoint
- Do not expose the deprecated `POST .../entities/{id}/regenerate` endpoint

**Detection:** Search OpenAPI spec for `"deprecated": true` on every field before adding to UI.

**Phase relevance:** Phase 2 (node implementation). Must filter during parameter definition.

---

## Moderate Pitfalls

### Pitfall 6: Linter Description and DisplayName Micro-Rules

**What goes wrong:** The n8n eslint plugin has 40+ rules about parameter descriptions and display names. Boolean descriptions must start with "Whether". "ID" must be uppercase. Multi-sentence descriptions must end with a period. Single-sentence ones must NOT. DisplayNames must be title-cased. These are auto-fixable but generate a wall of lint errors that obscures real issues.

**Prevention:**
- Run `npm run lint:fix` frequently (most description rules are auto-fixable).
- Adopt conventions from the start:
  - Boolean params: `description: 'Whether to ...'`
  - All descriptions: start uppercase, no trailing period for single sentence
  - DisplayNames: Title Case, "ID" not "Id" or "id", "URL" not "Url"
  - Operation options must have an `action` property (e.g., `action: 'Create a bank'`)
  - Operations must have `noDataExpression: true`

**Phase relevance:** Phase 2-3 (node implementation). Write descriptions correctly from the start; fixing 30+ of them later is tedious.

---

### Pitfall 7: Collection Items with required: true

**What goes wrong:** Parameters inside a `collection` type (used for "Additional Fields") must NOT have `required: true`. The linter rule `node-param-collection-type-item-required` catches this.

**Why it happens:** Developers think "this field is important" and mark it required inside the collection. But collections are optional groups by design -- if a field is truly required, it should be a top-level parameter, not inside "Additional Fields."

**Consequences:** Linter failure. Also bad UX: users expect "Additional Fields" to be entirely optional.

**Prevention:** Only put genuinely optional parameters in the "Additional Fields" collection. Required parameters go as top-level `displayOptions`-gated fields.

**Phase relevance:** Phase 2 (parameter definitions). Architecture decision for every operation.

---

### Pitfall 8: Credential authenticate Field Misconfiguration

**What goes wrong:** The credential class's `authenticate` field must use `IAuthenticateGeneric` type. For the Hindsight API, the auth header is `Authorization` (standard HTTP header, optional on self-hosted).

**Why it happens:** Developers may not realize the header is optional, or may use wrong format.

**Consequences:** Every API call returns 401 Unauthorized on cloud deployments. Or self-hosted users can't use the node because auth is forced.

**Prevention:**
- The `authorization` header is optional per the OpenAPI spec. Use Bearer format: `Authorization: Bearer {apiKey}`.
- Make the API key field optional in the credential (or document that self-hosted users can leave it empty).
- The credential `name` field must end with `Api` (lowercase first char): `hindsightApi`.
- The `displayName` must end with `API` (uppercase): `Hindsight API`.
- `documentationUrl` must be a full HTTP URL for community nodes (rule: `cred-class-field-documentation-url-not-http-url`).
- Sensitive fields (apiKey) must have `typeOptions: { password: true }`.

**Detection:** Test credential by making a simple API call (e.g., list banks). If 401, check the header name and format.

**Phase relevance:** Phase 1-2 (credential implementation). Must be correct before any operation can be tested.

---

### Pitfall 9: Returning Wrong Data Shape from execute()

**What goes wrong:** `execute()` must return `Promise<INodeExecutionData[][]>` -- an array of arrays. Returning `INodeExecutionData[]` (single array) or plain JSON causes n8n to show "no output" or crash.

**Why it happens:** The double-array is unintuitive. The outer array represents output branches (most nodes have one), the inner array represents items.

**Consequences:** Node appears to succeed but produces no output items. Downstream nodes receive nothing.

**Prevention:** Always `return [returnData]` where `returnData` is `INodeExecutionData[]`. Each item must be `{ json: { ... } }` -- the `json` wrapper is required.

**Detection:** Test each operation and verify items appear in the n8n output panel.

**Phase relevance:** Phase 2 (node implementation).

---

### Pitfall 10: Not Processing All Input Items

**What goes wrong:** If the node receives multiple items (e.g., from a loop or previous node that output 10 items), each item must be processed. Developers often only process `items[0]` and ignore the rest.

**Why it happens:** Testing with a single item works fine. Multi-item behavior only surfaces in real workflows.

**Consequences:** Users connect the node after a node that outputs multiple items, and only the first is processed. Data loss.

**Prevention:** Always loop over `this.getInputData()`:
```typescript
const items = this.getInputData();
for (let i = 0; i < items.length; i++) {
  // process items[i]
}
```

**Detection:** Test with a manual trigger that sends 3+ items.

**Phase relevance:** Phase 2 (node implementation). Bake the loop pattern into every operation from the start.

---

### Pitfall 11: Icon Format and Reference Mistakes

**What goes wrong:** The node icon must be SVG (rule: `node-class-description-icon-not-svg`). The `icon` property must use `file:hindsight.svg` format with the `file:` prefix. Missing prefix or wrong extension causes a broken icon in the n8n UI.

**Prevention:** Use an SVG icon. Reference it as `icon: 'file:hindsight.svg'`. Place the SVG file in the same directory as the node file (`nodes/Hindsight/hindsight.svg`).

**Phase relevance:** Phase 1 (scaffolding).

---

### Pitfall 12: Sync vs Async Retain Confusion

**What goes wrong:** Retain defaults to `async: false` (synchronous), which blocks until fact extraction completes. For large content, this can timeout. When `async: true`, the response only contains `operation_id` -- no extracted facts or usage metrics.

**Why it happens:** Users don't understand the tradeoff between sync and async modes.

**Consequences:** n8n workflow timeouts on large retains; or users expect facts in async response and get confused by the minimal response.

**Prevention:** Make `async` a clear toggle in the UI with description: "Whether to process asynchronously. When enabled, returns immediately with an operation ID for tracking. When disabled (default), waits for completion and returns usage metrics." Default to `false`.

**Detection:** Test with large content payloads (>10KB) and verify timeout behavior.

**Phase relevance:** Phase 2 (retain implementation).

---

### Pitfall 13: Bank Must Exist Before Any Operation

**What goes wrong:** Calling retain/recall/reflect on a non-existent bank_id returns an error. Users expect banks to be auto-created.

**Why it happens:** Hindsight requires explicit bank creation via `PUT /v1/default/banks/{bank_id}`.

**Consequences:** Confusing error messages in n8n workflows for first-time users.

**Prevention:** Document clearly in the Bank ID field description that the bank must already exist. Consider adding a note: "Create banks first using the Bank > Create/Update operation."

**Detection:** Test every memory operation against a bank_id that doesn't exist yet.

**Phase relevance:** Phase 2 (memory operations).

---

### Pitfall 14: Tag Matching Mode Defaults Differ Per Endpoint

**What goes wrong:** Recall defaults `tags_match` to `"any"` (includes untagged memories). Document list defaults to `"any_strict"` (excludes untagged). Graph defaults to `"all_strict"`. Users get inconsistent filtering behavior across operations.

**Why it happens:** The API has per-endpoint defaults that make sense in their individual contexts but confuse users who expect consistency.

**Consequences:** Users filter by tags on recall and get untagged results, then filter on documents and don't. Leads to bug reports and confusion.

**Prevention:** Expose `tags_match` in Additional Fields for every operation that supports it, with the operation-specific default clearly documented. Do NOT normalize defaults across operations -- respect the API's per-endpoint defaults.

**Detection:** Test tag filtering on each operation with and without the tags_match parameter.

**Phase relevance:** Phase 2-3 (memory and document operations).

---

## Minor Pitfalls

### Pitfall 15: Collection Items Not Alphabetized

**What goes wrong:** If a collection (like "Additional Fields") has 5+ items, the linter requires them to be sorted alphabetically by `name`. Rule: `node-param-collection-type-unsorted-items`.

**Prevention:** Keep parameters in alphabetical order from the start. This applies to operation options with 5+ entries too (`node-param-multi-options-type-unsorted-items`).

**Phase relevance:** Phase 2-3.

---

### Pitfall 16: Limit Parameter Convention Violations

**What goes wrong:** If any operation uses a "limit" parameter (e.g., list banks), there are strict conventions: default must be 50, `minValue` must be a positive integer, description must be "Max number of results to return", and displayName must be "Limit".

**Prevention:** Use the exact convention. The linter has dedicated rules: `node-param-default-wrong-for-limit`, `node-param-description-wrong-for-limit`, `node-param-min-value-wrong-for-limit`.

**Phase relevance:** Phase 2 (list operations).

---

### Pitfall 17: Forgetting n8nNodesApiVersion

**What goes wrong:** The `n8nNodesApiVersion` in package.json must be present and be a number (not string). Missing it or setting `"1"` instead of `1` triggers linter failures.

**Prevention:** Set `"n8nNodesApiVersion": 1` (number, not string) in the n8n block.

**Phase relevance:** Phase 1 (scaffolding).

---

### Pitfall 18: Not Rebuilding After Description Changes

**What goes wrong:** n8n caches node descriptions at startup. Changing `description` properties in the TypeScript source has no effect until you stop n8n, rebuild (`npm run build`), and restart.

**Why it happens:** Developers expect hot-reload for property changes. It does not work for node metadata.

**Prevention:** After any change to node descriptions, operations, or parameters: `ctrl+c`, `npm run build`, `npm run dev`.

**Detection:** Changes to displayNames, descriptions, or options not appearing in the n8n UI.

**Phase relevance:** Phase 2-3 (development workflow). Set expectations early.

---

### Pitfall 19: Metadata Must Be String-String Map

**What goes wrong:** MemoryItem `metadata` is `Record<string, string>` -- values must be strings. Users may try to pass numbers, booleans, or objects.

**Prevention:** Use n8n's keyValue collection type which naturally produces string pairs. Document the constraint in the field description.

**Phase relevance:** Phase 2 (retain implementation).

---

### Pitfall 20: Mental Model ID Constraints

**What goes wrong:** Custom mental model IDs must be "alphanumeric lowercase with hyphens." UUIDs or names with spaces will fail.

**Prevention:** Document the constraint in the ID field description. Consider adding a placeholder example like "my-model-name".

**Phase relevance:** Phase 3 (mental model operations).

---

### Pitfall 21: Base URL Trailing Slash

**What goes wrong:** User enters `http://localhost:8888/` with trailing slash, node constructs `http://localhost:8888//v1/default/banks/...` with double slash.

**Prevention:** Strip trailing slashes from base URL in credential or node code before constructing URLs.

**Phase relevance:** Phase 1 (credential implementation).

---

### Pitfall 22: Config Update Accepts Free-Form Object

**What goes wrong:** `PATCH .../config` accepts `{updates: {any_key: any_value}}`. Users could set invalid keys or credential-level fields (`llm_api_key`). Server-side validation catches this but error messages may be unclear.

**Prevention:** In the n8n UI, provide known safe config keys as a dropdown or use a fixedCollection rather than a free-form JSON field. Exclude credential-like keys.

**Phase relevance:** Phase 2-3 (config operations).

---

### Pitfall 23: Disposition Values Out of Range

**What goes wrong:** DispositionTraits fields (skepticism, literalism, empathy) must be integers 1-5. Values outside range cause 422 validation errors.

**Prevention:** Use n8n number fields with min=1, max=5 constraints in `typeOptions`. Or use a dropdown with values 1 through 5.

**Phase relevance:** Phase 2 (bank profile/config operations).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Scaffolding (Phase 1) | Naming mismatch (#1), package.json misconfiguration (#2), icon issues (#11), n8nNodesApiVersion (#17), trailing slash (#21) | Validate with `npm run build && npm run lint` before writing any node logic |
| Credential (Phase 1-2) | Wrong authenticate header (#8), missing password typeOption, optional auth handling | Verify Hindsight uses `Authorization` header from OpenAPI spec; test with real API call immediately |
| Node implementation (Phase 2) | Missing continueOnFail (#3), deprecated request helper (#4), wrong return shape (#9), single-item processing (#10), deprecated API fields (#5) | Use the execute() template from Pitfall #3; filter deprecated fields from UI |
| Retain operation (Phase 2) | Sync/async confusion (#12), metadata type (#19), bank must exist (#13) | Clear UI descriptions for async toggle; use keyValue for metadata |
| Recall/Reflect (Phase 2) | Tag matching defaults differ (#14), recall vs reflect confusion | Per-operation default documentation; clear operation descriptions |
| Parameter definitions (Phase 2-3) | Description micro-rules (#6), required in collection (#7), unsorted items (#15), limit conventions (#16) | Run `npm run lint:fix` after every batch of parameter additions |
| Config operations (Phase 2-3) | Free-form config object (#22), disposition range (#23) | Pre-define known keys; use min/max constraints |
| Mental models (Phase 3) | ID constraints (#20) | Document alphanumeric-lowercase-with-hyphens constraint |
| Testing and iteration (Phase 3) | Not rebuilding after changes (#18) | Always rebuild + restart after description changes |
| Publishing (Phase 4) | Missing keyword, default description/author, non-MIT license (#2) | Run full lint before any npm publish |

## Sources

- [Hindsight OpenAPI Specification v0.4.20](https://hindsight.vectorize.io/openapi.json) -- deprecated field markers
- [Hindsight Configuration Guide](https://hindsight.vectorize.io/developer/configuration) -- config key documentation
- [n8n Node Linter Documentation](https://docs.n8n.io/integrations/creating-nodes/test/node-linter/)
- [eslint-plugin-n8n-nodes-base - Full Rule List](https://github.com/ivov/eslint-plugin-n8n-nodes-base/blob/master/README.md)
- [n8n Node File Structure](https://docs.n8n.io/integrations/creating-nodes/build/reference/node-file-structure/)
- [n8n Troubleshooting Node Development](https://docs.n8n.io/integrations/creating-nodes/test/troubleshooting-node-development/)
- [n8n HTTP Request Helpers (httpRequest vs request)](https://docs.n8n.io/integrations/creating-nodes/build/reference/http-helpers/)
- [n8n UX Guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/)
- [n8n Community Node Building Guide](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/)
- [n8n-nodes-starter Repository](https://github.com/n8n-io/n8n-nodes-starter)
- [n8n Error Handling Reference](https://docs.n8n.io/integrations/creating-nodes/build/reference/error-handling/)
- [n8n Credential Files Reference](https://docs.n8n.io/integrations/creating-nodes/build/reference/credentials-files/)
- [Community: File Rename Constructor Error](https://community.n8n.io/t/getting-error-if-i-change-file-name-examplenode-node-js-to-testnode-node-js/63046)
- [GitHub: Instance Crash on NodeApiError](https://github.com/n8n-io/n8n/issues/14742)
- [Community: httpRequest vs request](https://community.n8n.io/t/this-helpers-httprequest-vs-request/21226)
- [Community: Node Not Appearing After Install](https://github.com/n8n-io/n8n/issues/23422)
