# Technology Stack

**Project:** n8n-nodes-hindsight
**Researched:** 2026-03-26

## Recommended Stack

The entire stack is dictated by n8n's official starter repo (`n8n-io/n8n-nodes-starter` on GitHub, master branch as of March 2026). Deviating from it means fighting the linter and build tooling. Follow it exactly.

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| TypeScript | 5.9.3 | Language | Starter repo pins this version; n8n types require it | HIGH |
| n8n-workflow | `*` (peer dep) | Type definitions (INodeType, ICredentialType, etc.) | Peer dependency -- n8n provides it at runtime. Never bundle it. | HIGH |
| Node.js | >= 18.17 | Runtime | n8n 1.0+ requires Node 18.17+; Node 20 LTS recommended for dev | MEDIUM |

### Build & Dev Tooling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @n8n/node-cli | `*` (latest) | Build, lint, dev server, release, scaffolding | The official CLI. Runs `n8n-node build`, `n8n-node lint`, `n8n-node dev`. Replaces raw tsc/eslint invocations. | HIGH |
| ESLint | 9.39.4 | Linting | Starter repo pins this. Config is flat-config (`eslint.config.mjs`) importing from `@n8n/node-cli/eslint`. | HIGH |
| Prettier | 3.8.1 | Formatting | Starter repo pins this. Config in `.prettierrc.js`. | HIGH |
| release-it | 19.2.4 | Versioning & npm publish | Starter repo pins this. Used via `n8n-node release`. | HIGH |

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| npm | >= 9 | Package manager | Starter repo uses `package-lock.json`. Do not use yarn/pnpm -- `n8n-node dev` expects npm. | HIGH |
| GitHub Actions | -- | CI/CD for npm publish | Starter includes `.github/workflows/` for automated publish with provenance attestation (required by npm starting May 1, 2026). | MEDIUM |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| (none) | -- | -- | Do NOT add HTTP client libraries (axios, node-fetch, etc.). Use `this.helpers.httpRequestWithAuthentication()` which is built into the n8n runtime. | HIGH |

**Key insight:** Community nodes should have ZERO runtime dependencies. Everything needed (HTTP client, JSON handling, error classes) comes from `n8n-workflow` at runtime. Only devDependencies are needed.

## Exact package.json Structure

This is the canonical format. The `n8n` block is load-bearing -- n8n reads it at startup to register nodes and credentials.

```json
{
  "name": "n8n-nodes-hindsight",
  "version": "0.1.0",
  "description": "n8n community node for Hindsight AI memory API by Vectorize.io",
  "license": "MIT",
  "homepage": "https://github.com/<owner>/n8n-nodes-hindsight",
  "keywords": [
    "n8n-community-node-package"
  ],
  "author": {
    "name": "",
    "email": ""
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/<owner>/n8n-nodes-hindsight.git"
  },
  "scripts": {
    "build": "n8n-node build",
    "build:watch": "tsc --watch",
    "dev": "n8n-node dev",
    "lint": "n8n-node lint",
    "lint:fix": "n8n-node lint --fix",
    "release": "n8n-node release",
    "prepublishOnly": "n8n-node prerelease"
  },
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "strict": true,
    "credentials": [
      "dist/credentials/HindsightApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/Hindsight/Hindsight.node.js"
    ]
  },
  "devDependencies": {
    "@n8n/node-cli": "*",
    "eslint": "9.39.4",
    "prettier": "3.8.1",
    "release-it": "19.2.4",
    "typescript": "5.9.3"
  },
  "peerDependencies": {
    "n8n-workflow": "*"
  }
}
```

**Critical details:**
- `"keywords": ["n8n-community-node-package"]` -- required for n8n to discover it as a community node
- `"files": ["dist"]` -- only ship compiled JS, not source TS
- `"n8n.strict": true` -- enables stricter linting rules from `@n8n/node-cli`
- `"n8n.n8nNodesApiVersion": 1` -- current API version
- Paths in `n8n.credentials` and `n8n.nodes` point to compiled `.js` files in `dist/`
- `n8n-workflow` is a **peer dependency** with `"*"` -- never pin a specific version

## Exact File Structure

```
n8n-nodes-hindsight/
├── credentials/
│   └── HindsightApi.credentials.ts      # Credential type definition
├── nodes/
│   └── Hindsight/
│       ├── Hindsight.node.ts             # Main node (INodeType)
│       ├── Hindsight.node.json           # Codex metadata (categories, resources)
│       └── hindsight.svg                 # Node icon (60x60, lowercase filename)
├── icons/                                # Optional: shared icons
├── .prettierrc.js                        # Prettier config (copy from starter)
├── eslint.config.mjs                     # ESLint flat config (copy from starter)
├── tsconfig.json                         # TypeScript config (copy from starter)
├── package.json                          # Package config with n8n block
├── package-lock.json
├── LICENSE.md
└── README.md
```

### Naming Conventions (enforced by linter)

| Item | Convention | Example |
|------|-----------|---------|
| Package name | `n8n-nodes-<service>` lowercase | `n8n-nodes-hindsight` |
| Node file | `<ServiceName>.node.ts` PascalCase | `Hindsight.node.ts` |
| Node class | PascalCase, matches filename | `export class Hindsight implements INodeType` |
| Node internal name | camelCase | `name: 'hindsight'` |
| Node displayName | Title Case | `displayName: 'Hindsight'` |
| Credential file | `<ServiceName>Api.credentials.ts` | `HindsightApi.credentials.ts` |
| Credential class | PascalCase + `Api` suffix | `export class HindsightApi implements ICredentialType` |
| Credential internal name | camelCase + `Api` suffix | `name: 'hindsightApi'` |
| Icon file | lowercase `.svg` | `hindsight.svg` |
| Codex file | matches node filename + `.json` | `Hindsight.node.json` |

## TypeScript Configuration

Copy exactly from starter repo. Key settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es2019",
    "lib": ["es2019", "es2020", "es2022.error"],
    "removeComments": true,
    "useUnknownInCatchVariables": false,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "preserveConstEnums": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "incremental": true,
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "outDir": "./dist/"
  },
  "include": ["credentials/**/*", "nodes/**/*", "nodes/**/*.json", "package.json"]
}
```

**Do not change these settings.** The `@n8n/node-cli` build and lint commands expect this exact configuration.

## ESLint Configuration

Single file, minimal -- delegates everything to `@n8n/node-cli`:

```javascript
// eslint.config.mjs
import { config } from '@n8n/node-cli/eslint';

export default config;
```

The n8n ESLint preset enforces n8n-specific rules (node description structure, credential patterns, naming conventions). This is what `n8n-node lint` runs.

## Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'all',
  bracketSpacing: true,
  useTabs: true,
  tabWidth: 2,
  arrowParens: 'always',
  singleQuote: true,
  quoteProps: 'as-needed',
  endOfLine: 'lf',
  printWidth: 100,
};
```

**Notable:** n8n uses **tabs**, not spaces. Use `useTabs: true`.

## Credential Pattern (API Key via Header)

For Hindsight's API key auth, use the `IAuthenticateGeneric` pattern with header injection:

```typescript
import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class HindsightApi implements ICredentialType {
  name = 'hindsightApi';
  displayName = 'Hindsight API';
  // icon can be added: icon = 'file:../nodes/Hindsight/hindsight.svg';
  documentationUrl = 'https://hindsight.vectorize.io';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'http://localhost:8888',
      description: 'Base URL of your Hindsight instance',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials?.apiKey}}',
        // NOTE: Verify exact header name from Hindsight API docs
        // Could be X-Api-Key, Authorization: Bearer, etc.
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials?.baseUrl}}',
      url: '/banks',  // Lightweight endpoint to test connectivity
      method: 'GET',
    },
  };
}
```

**Confidence: MEDIUM** -- The exact auth header name needs verification against Hindsight API docs. The pattern itself is HIGH confidence.

## Programmatic Node Pattern (Execute Method)

The project uses programmatic style (not declarative) for full control over request construction:

```typescript
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError, NodeOperationError } from 'n8n-workflow';

export class Hindsight implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Hindsight',
    name: 'hindsight',
    icon: 'file:hindsight.svg',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Hindsight AI memory API',
    defaults: { name: 'Hindsight' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
      {
        name: 'hindsightApi',
        required: true,
      },
    ],
    properties: [
      // resource, operation, and field definitions
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        // Build request options based on resource + operation
        const credentials = await this.getCredentials('hindsightApi');
        const baseUrl = credentials.baseUrl as string;

        const response = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'hindsightApi',
          {
            method: 'POST',
            url: `${baseUrl}/endpoint`,
            body: {},
            json: true,
          },
        );

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(response),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
        } else {
          throw new NodeApiError(this.getNode(), error as Record<string, unknown>, {
            itemIndex: i,
          });
        }
      }
    }

    return [returnData];
  }
}
```

**Key patterns:**
- `this.helpers.httpRequestWithAuthentication` -- handles auth header injection automatically via credential's `authenticate` block
- `this.helpers.constructExecutionMetaData` + `this.helpers.returnJsonArray` -- required for proper item linking in n8n UI
- `this.continueOnFail()` -- respect user's "Continue on Fail" setting
- `NodeApiError` for API errors, `NodeOperationError` for validation errors
- `getCredentials('hindsightApi')` to access credential fields like `baseUrl`

## Codex Metadata File

```json
{
  "node": "n8n-nodes-base.hindsight",
  "nodeVersion": "1.0",
  "codexVersion": "1.0",
  "categories": ["AI"],
  "resources": {
    "primaryDocumentation": [
      {
        "url": "https://hindsight.vectorize.io"
      }
    ]
  }
}
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Node style | Programmatic | Declarative (HTTP Request-based) | Declarative is simpler but cannot handle dynamic body construction, conditional parameter inclusion, or complex optional field merging that Hindsight's API needs |
| HTTP client | `this.helpers.httpRequestWithAuthentication` | axios / node-fetch | Built-in helper handles auth, retries, and n8n integration. External libs add unnecessary bundle size and peer conflicts |
| Monorepo | Single package | Lerna/Turborepo monorepo | Single node package, no need for monorepo complexity |
| Testing | None (v1) | Jest / Vitest | Out of scope per PROJECT.md. Can add later without affecting package structure |
| Package manager | npm | pnpm / yarn | `n8n-node dev` uses npm internally. Mixing managers causes lockfile conflicts |

## What NOT to Use

| Do Not Use | Why |
|------------|-----|
| Any runtime dependency | Community nodes should have zero runtime deps. Everything comes from n8n-workflow at runtime |
| `axios`, `node-fetch`, `got` | Use `this.helpers.httpRequestWithAuthentication()` instead |
| `.eslintrc.js` / `.eslintrc.json` | ESLint 9 uses flat config (`eslint.config.mjs`). Old format will break |
| Spaces for indentation | n8n convention is tabs. Prettier config enforces this |
| `yarn` or `pnpm` | `@n8n/node-cli` expects npm |
| Pinned `n8n-workflow` version | Must be `"*"` peer dep -- n8n provides the version at runtime |
| `ts-node` / `tsx` for dev | Use `n8n-node dev` which handles compilation and hot reload |

## Installation (for development)

```bash
# Clone and install
git clone <repo-url> n8n-nodes-hindsight
cd n8n-nodes-hindsight
npm install

# Development (starts local n8n with node loaded)
npm run dev

# Build
npm run build

# Lint
npm run lint
npm run lint:fix

# Release
npm run release
```

## User Installation (in n8n)

```bash
# Navigate to n8n's custom extensions directory
cd ~/.n8n/custom
npm install n8n-nodes-hindsight
# Restart n8n
```

## Sources

- [n8n-nodes-starter repo (GitHub)](https://github.com/n8n-io/n8n-nodes-starter) -- package.json, tsconfig.json, eslint.config.mjs, .prettierrc.js, node examples (HIGH confidence)
- [n8n-nodes-starter package.json (raw)](https://github.com/n8n-io/n8n-nodes-starter/blob/master/package.json) -- exact dependency versions (HIGH confidence)
- [@n8n/node-cli (npm)](https://www.npmjs.com/package/@n8n/node-cli) -- CLI tool commands and purpose (HIGH confidence)
- [n8n-workflow (npm)](https://www.npmjs.com/package/n8n-workflow) -- current version 2.13.0, interface exports (HIGH confidence)
- [Programmatic Style Nodes (DeepWiki)](https://deepwiki.com/n8n-io/n8n-docs/5.3-external-secrets-integration) -- INodeType, execute pattern, httpRequestWithAuthentication (MEDIUM confidence)
- [n8n community node naming conventions](https://docs.n8n.io/integrations/creating-nodes/build/reference/node-file-structure/) -- file and class naming rules (HIGH confidence via web search corroboration)
- [Building community nodes (n8n docs)](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/) -- package.json `n8n` block format, keyword requirements (HIGH confidence)
