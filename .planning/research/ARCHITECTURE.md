# Architecture Patterns

**Domain:** n8n community node (programmatic style, multi-resource)
**Researched:** 2026-03-26

## Recommended Architecture

A single-node package following the n8n-nodes-starter conventions. One node class (`Hindsight`) with two resources (Bank, Memory), each with multiple operations. One credential class (`HindsightApi`). Programmatic `execute()` method with resource/operation switch dispatching to per-operation handler functions.

### File Layout

```
n8n-nodes-hindsight/
  package.json              # n8n block declares nodes + credentials paths
  tsconfig.json             # Strict, commonjs, target es2019, outDir ./dist/
  eslint.config.mjs         # Re-exports @n8n/node-cli/eslint config
  .prettierrc.js
  credentials/
    HindsightApi.credentials.ts   # ICredentialType: API key + base URL
  nodes/
    Hindsight/
      Hindsight.node.ts           # Main node class (INodeType)
      Hindsight.node.json         # Codex metadata (categories, docs URL)
      hindsight.svg               # Node icon (light mode)
      hindsight.dark.svg          # Node icon (dark mode, optional)
      resources/
        bank/
          index.ts                # Bank resource: operation definitions + field properties
          create.ts               # Bank create operation fields (INodeProperties[])
          list.ts                 # Bank list operation fields
          get.ts                  # Bank get operation fields
          delete.ts               # Bank delete operation fields
          updateConfiguration.ts  # Bank update config operation fields
        memory/
          index.ts                # Memory resource: operation definitions + field properties
          retain.ts               # Memory retain (store) operation fields
          recall.ts               # Memory recall (search) operation fields
          reflect.ts              # Memory reflect operation fields
      shared/
        transport.ts              # HTTP request helper (hindsightApiRequest)
        types.ts                  # Shared TypeScript interfaces
  dist/                           # Compiled output (gitignored, published to npm)
```

**Confidence:** HIGH -- This mirrors the official n8n-nodes-starter GithubIssues example exactly.

### Why This Layout

The starter repo (as of March 2026) organizes multi-resource nodes with:
- `resources/<resourceName>/index.ts` exporting operation definitions + spreading per-operation field arrays
- `shared/transport.ts` for the authenticated HTTP helper
- Per-operation files exporting `INodeProperties[]` arrays with `displayOptions` scoped to that resource+operation

This keeps each operation's UI definition isolated and testable, while the main node file stays clean.

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `HindsightApi.credentials.ts` | Stores API key + base URL; injects auth header on requests | n8n credential system; referenced by node |
| `Hindsight.node.ts` | Node description (resources, operations); `execute()` dispatches to handlers | Credential, transport helper, operation field modules |
| `resources/bank/index.ts` | Exports `bankDescription: INodeProperties[]` (operation dropdown + all bank fields) | Spread into main node's `properties` |
| `resources/memory/index.ts` | Exports `memoryDescription: INodeProperties[]` (operation dropdown + all memory fields) | Spread into main node's `properties` |
| `shared/transport.ts` | `hindsightApiRequest()` -- builds URL, attaches auth, makes HTTP call | Credential system via `this.helpers.httpRequestWithAuthentication` |

## Credential Structure

```typescript
// credentials/HindsightApi.credentials.ts
import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class HindsightApi implements ICredentialType {
  name = 'hindsightApi';
  displayName = 'Hindsight API';
  // documentationUrl = 'https://hindsight.vectorize.io';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'http://localhost:8888',
      description: 'Hindsight API base URL (default for self-hosted)',
    },
  ];

  // Inject API key as header on every request
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        // Exact header name TBD -- verify against Hindsight API docs
        Authorization: '={{$credentials.apiKey}}',
      },
    },
  };

  // Test credential validity
  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/banks',       // lightweight endpoint to verify connectivity
      method: 'GET',
    },
  };
}
```

**Key points:**
- `authenticate` uses `IAuthenticateGeneric` with `type: 'generic'` to inject the API key into request headers automatically. The exact header name (e.g., `Authorization`, `X-API-Key`, `Bearer`) must be verified against Hindsight API docs.
- `test` defines a lightweight request n8n fires when user clicks "Test" in credential setup.
- `baseUrl` property lets users point at localhost (self-hosted) or Hindsight Cloud.

**Confidence:** HIGH for the pattern; LOW for the exact auth header name (needs Hindsight API verification).

## Node Description Structure (Resource/Operation Pattern)

```typescript
// nodes/Hindsight/Hindsight.node.ts
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { bankDescription } from './resources/bank';
import { memoryDescription } from './resources/memory';
import { hindsightApiRequest } from './shared/transport';

export class Hindsight implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Hindsight',
    name: 'hindsight',
    icon: 'file:hindsight.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Hindsight AI Memory API',
    defaults: {
      name: 'Hindsight',
    },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'hindsightApi',
        required: true,
      },
    ],
    properties: [
      // --- Resource selector (top-level dropdown) ---
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Bank', value: 'bank' },
          { name: 'Memory', value: 'memory' },
        ],
        default: 'memory',
      },
      // --- Spread per-resource operation + field definitions ---
      ...bankDescription,
      ...memoryDescription,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        // Dispatch based on resource + operation
        if (resource === 'bank') {
          if (operation === 'create') {
            // ... build body, call hindsightApiRequest
          }
          // ... other bank operations
        }
        if (resource === 'memory') {
          if (operation === 'retain') {
            // ... build body, call hindsightApiRequest
          }
          // ... other memory operations
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
          continue;
        }
        throw error;
      }
    }
    return [returnData];
  }
}
```

**Key architectural decisions:**
- Resource dropdown at top; each resource module exports its own operation dropdown + fields with `displayOptions` scoped to that resource.
- `subtitle` template shows the current resource+operation in the node card.
- `usableAsTool: true` makes the node available as an AI agent tool.
- `noDataExpression: true` on resource/operation prevents expression input (dropdowns only).

## Resource Module Pattern

Each resource's `index.ts` exports a single `INodeProperties[]` array that includes:
1. The operation dropdown (scoped to that resource via `displayOptions`)
2. All per-operation field arrays spread in

```typescript
// resources/bank/index.ts
import type { INodeProperties } from 'n8n-workflow';
import { bankCreateDescription } from './create';
import { bankListDescription } from './list';
import { bankGetDescription } from './get';
import { bankDeleteDescription } from './delete';
import { bankUpdateConfigDescription } from './updateConfiguration';

const operations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['bank'],
    },
  },
  options: [
    { name: 'Create', value: 'create', action: 'Create a bank', description: 'Create a new memory bank' },
    { name: 'Delete', value: 'delete', action: 'Delete a bank', description: 'Delete a memory bank' },
    { name: 'Get', value: 'get', action: 'Get a bank', description: 'Get a memory bank by ID' },
    { name: 'List', value: 'list', action: 'List banks', description: 'List all memory banks' },
    { name: 'Update Configuration', value: 'updateConfiguration', action: 'Update bank configuration', description: 'Update bank mission, directives, or disposition' },
  ],
  default: 'list',
};

export const bankDescription: INodeProperties[] = [
  operations,
  ...bankCreateDescription,
  ...bankListDescription,
  ...bankGetDescription,
  ...bankDeleteDescription,
  ...bankUpdateConfigDescription,
];
```

## Per-Operation Field Pattern

Each operation file exports `INodeProperties[]` with `displayOptions` scoped to its resource+operation combination.

```typescript
// resources/memory/retain.ts
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMemoryRetain = {
  resource: ['memory'],
  operation: ['retain'],
};

export const memoryRetainDescription: INodeProperties[] = [
  // --- Required fields (shown directly in the node UI) ---
  {
    displayName: 'Bank ID',
    name: 'bankId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the memory bank to store the memory in',
    displayOptions: { show: showOnlyForMemoryRetain },
  },
  {
    displayName: 'Content',
    name: 'content',
    type: 'string',
    typeOptions: { rows: 4 },
    required: true,
    default: '',
    description: 'The memory content to store',
    displayOptions: { show: showOnlyForMemoryRetain },
  },

  // --- Optional fields (collapsed under "Additional Fields") ---
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: showOnlyForMemoryRetain },
    options: [
      {
        displayName: 'Memory Type',
        name: 'memoryType',
        type: 'options',
        options: [
          { name: 'Episodic', value: 'episodic' },
          { name: 'Semantic', value: 'semantic' },
          { name: 'Procedural', value: 'procedural' },
        ],
        default: 'episodic',
        description: 'Type of memory to store',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Additional metadata as JSON',
      },
    ],
  },
];
```

**How Additional Fields work:**
- `type: 'collection'` with `placeholder: 'Add Field'` renders a dropdown button
- User clicks "Add Field" and selects which optional params to fill in
- In `execute()`, retrieve via: `const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;`
- Each key in `additionalFields` is only present if the user added it
- Spread into the request body: `Object.assign(body, additionalFields);`

## Transport / HTTP Helper Pattern

```typescript
// shared/transport.ts
import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
} from 'n8n-workflow';

export async function hindsightApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  path: string,
  body?: object,
  qs?: object,
): Promise<any> {
  const credentials = await this.getCredentials('hindsightApi');
  const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${path}`,
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }
  if (qs && Object.keys(qs).length > 0) {
    options.qs = qs;
  }

  return await this.helpers.httpRequestWithAuthentication.call(
    this,
    'hindsightApi',
    options,
  );
}
```

**Why a custom helper instead of inline requests:**
- Centralizes base URL construction from credentials
- Single place to handle auth credential name
- Consistent error handling can be added once
- Every operation calls `hindsightApiRequest.call(this, 'POST', '/banks', body)`

## Codex Metadata File

```json
// nodes/Hindsight/Hindsight.node.json
{
  "node": "n8n-nodes-hindsight",
  "nodeVersion": "1.0",
  "codexVersion": "1.0",
  "categories": ["AI", "Developer Tools"],
  "resources": {
    "primaryDocumentation": [
      { "url": "https://github.com/<owner>/n8n-nodes-hindsight" }
    ]
  }
}
```

## package.json n8n Block

```json
{
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/HindsightApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/Hindsight/Hindsight.node.js"
    ]
  }
}
```

**Critical:** Paths point to compiled `.js` files in `dist/`, not `.ts` source files.

## Patterns to Follow

### Pattern 1: Resource/Operation Dispatch
**What:** Top-level `resource` dropdown, per-resource `operation` dropdown, `execute()` dispatches via nested if/switch.
**When:** Always -- this is the canonical n8n multi-resource pattern.
**Why:** Users see a clean two-level hierarchy. n8n's `displayOptions` system hides irrelevant fields automatically.

### Pattern 2: Additional Fields Collection
**What:** Optional API parameters grouped under `type: 'collection'` with `displayName: 'Additional Fields'`.
**When:** Any operation with optional parameters (most of them).
**Why:** Keeps the default UI clean (only required fields visible). Users opt in to advanced params.

### Pattern 3: Centralized Transport Helper
**What:** Single `hindsightApiRequest()` function handling base URL, auth, and request construction.
**When:** Always -- every operation uses the same auth and base URL.
**Why:** DRY. Changing auth header or base URL logic is a one-line fix.

### Pattern 4: Per-Item Loop with continueOnFail
**What:** Loop over `getInputData()` items, wrap each in try/catch, check `continueOnFail()`.
**When:** Always in the execute method.
**Why:** n8n nodes process batches of items. Users expect per-item error handling.

### Pattern 5: constructExecutionMetaData
**What:** Wrap API responses with `this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: i } })`.
**When:** Building return data in the item loop.
**Why:** Preserves item-to-item lineage for n8n's data flow tracking.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Monolithic Properties Array
**What:** Defining all properties inline in the main node file.
**Why bad:** Hundreds of lines of property definitions make the node file unreadable.
**Instead:** Split into resource modules with per-operation files.

### Anti-Pattern 2: Hardcoded Base URL
**What:** Embedding `http://localhost:8888` directly in the transport helper.
**Why bad:** Breaks for Hindsight Cloud users; no configurability.
**Instead:** Read base URL from credentials.

### Anti-Pattern 3: Ignoring displayOptions
**What:** Showing all fields regardless of selected resource/operation.
**Why bad:** Users see dozens of irrelevant fields. UX disaster.
**Instead:** Every field gets `displayOptions: { show: { resource: [...], operation: [...] } }`.

### Anti-Pattern 4: Not Handling Empty additionalFields
**What:** Blindly spreading `additionalFields` into body without checking for undefined keys.
**Why bad:** Sends `undefined` values to the API.
**Instead:** Filter out undefined/empty values before adding to body.

## Build Order Implications

The dependency chain for implementation:

```
1. Credential (HindsightApi.credentials.ts)
   - No dependencies, can be built first
   - Verify exact auth header against Hindsight API docs
   - Test credential must work before anything else

2. Transport helper (shared/transport.ts)
   - Depends on: credential name
   - Build immediately after credential
   - Can be tested with a simple GET /banks call

3. Resource field definitions (resources/bank/*.ts, resources/memory/*.ts)
   - Depends on: knowing exact API parameters per endpoint
   - Build per-operation: define INodeProperties[] arrays
   - No runtime dependency -- these are just data structures

4. Resource index files (resources/bank/index.ts, resources/memory/index.ts)
   - Depends on: all per-operation field files for that resource
   - Just re-exports, trivial

5. Main node file (Hindsight.node.ts)
   - Depends on: all resource descriptions + transport
   - Wire up description (spread resource descriptions)
   - Implement execute() dispatch logic

6. Codex + package.json
   - Final wiring: ensure n8n block paths are correct
   - Codex metadata for discoverability
```

**Recommended build sequence:**
1. Scaffold from starter repo (package.json, tsconfig, eslint)
2. Credential type (lets you test auth immediately)
3. Transport helper (lets you test API connectivity)
4. One complete resource (e.g., Bank with all operations) -- proves the pattern end-to-end
5. Second resource (Memory) following the established pattern
6. Polish: codex, icon, subtitle, error messages

This sequence lets you validate the core pattern early with Bank (simpler CRUD), then apply the proven pattern to Memory (more complex params).

## Data Flow

```
User selects Resource → Operation → fills Required Fields → optionally adds Additional Fields
                                                                        |
execute() called with batch of items                                    |
  for each item:                                                        v
    read resource, operation, required params, additionalFields from getNodeParameter()
    build request body (required + additionalFields merged)
    call hindsightApiRequest(method, path, body)
    wrap response with constructExecutionMetaData
    push to returnData
  return [returnData]
```

## Sources

- [n8n-nodes-starter repo (file tree and source)](https://github.com/n8n-io/n8n-nodes-starter) -- HIGH confidence
- [n8n programmatic style tutorial](https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/) -- HIGH confidence
- [n8n credential files reference](https://docs.n8n.io/integrations/creating-nodes/build/reference/credentials-files/) -- HIGH confidence
- [DeepWiki: Programmatic Style Nodes](https://deepwiki.com/n8n-io/n8n-docs/5.3-external-secrets-integration) -- MEDIUM confidence (third-party synthesis)
- [Franky's Notes: Custom n8n Node Guide (Jan 2026)](https://www.frankysnotes.com/2026/01/writing-my-first-custom-n8n-node-step.html) -- MEDIUM confidence
- [Sankalp Khawade: Building Custom Nodes in n8n (Jul 2025)](https://medium.com/@sankalpkhawade/building-custom-nodes-in-n8n-a-complete-developers-guide-0ddafe1558ca) -- MEDIUM confidence
