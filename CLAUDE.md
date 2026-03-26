<!-- GSD:project-start source:PROJECT.md -->
## Project

**n8n-nodes-hindsight**

An n8n community node package that wraps the Hindsight REST API by Vectorize.io. It gives n8n workflow builders access to Hindsight's AI memory system — storing, searching, and reflecting on memories organized into banks — directly from their automation workflows. The package targets n8n 1.0+ and follows all official community node conventions.

**Core Value:** Expose every useful Hindsight API operation to n8n workflow builders with clean UX — required fields upfront, optional fields in "Additional Fields" collections — so users can integrate persistent AI memory into any automation without leaving n8n.

### Constraints

- **Scaffolding**: Must start from n8n-nodes-starter repo patterns, not from scratch
- **Naming conventions**: Must follow n8n's exact naming rules (file names, class names, package.json entries)
- **Linting**: Must pass `npm run lint` with n8n's eslint config
- **Package structure**: n8n block in package.json must declare nodes and credentials paths correctly
- **Auth**: API key sent as header (exact header name per Hindsight docs)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
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
## Exact package.json Structure
- `"keywords": ["n8n-community-node-package"]` -- required for n8n to discover it as a community node
- `"files": ["dist"]` -- only ship compiled JS, not source TS
- `"n8n.strict": true` -- enables stricter linting rules from `@n8n/node-cli`
- `"n8n.n8nNodesApiVersion": 1` -- current API version
- Paths in `n8n.credentials` and `n8n.nodes` point to compiled `.js` files in `dist/`
- `n8n-workflow` is a **peer dependency** with `"*"` -- never pin a specific version
## Exact File Structure
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
## ESLint Configuration
## Prettier Configuration
## Credential Pattern (API Key via Header)
## Programmatic Node Pattern (Execute Method)
- `this.helpers.httpRequestWithAuthentication` -- handles auth header injection automatically via credential's `authenticate` block
- `this.helpers.constructExecutionMetaData` + `this.helpers.returnJsonArray` -- required for proper item linking in n8n UI
- `this.continueOnFail()` -- respect user's "Continue on Fail" setting
- `NodeApiError` for API errors, `NodeOperationError` for validation errors
- `getCredentials('hindsightApi')` to access credential fields like `baseUrl`
## Codex Metadata File
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
# Clone and install
# Development (starts local n8n with node loaded)
# Build
# Lint
# Release
## User Installation (in n8n)
# Navigate to n8n's custom extensions directory
# Restart n8n
## Sources
- [n8n-nodes-starter repo (GitHub)](https://github.com/n8n-io/n8n-nodes-starter) -- package.json, tsconfig.json, eslint.config.mjs, .prettierrc.js, node examples (HIGH confidence)
- [n8n-nodes-starter package.json (raw)](https://github.com/n8n-io/n8n-nodes-starter/blob/master/package.json) -- exact dependency versions (HIGH confidence)
- [@n8n/node-cli (npm)](https://www.npmjs.com/package/@n8n/node-cli) -- CLI tool commands and purpose (HIGH confidence)
- [n8n-workflow (npm)](https://www.npmjs.com/package/n8n-workflow) -- current version 2.13.0, interface exports (HIGH confidence)
- [Programmatic Style Nodes (DeepWiki)](https://deepwiki.com/n8n-io/n8n-docs/5.3-external-secrets-integration) -- INodeType, execute pattern, httpRequestWithAuthentication (MEDIUM confidence)
- [n8n community node naming conventions](https://docs.n8n.io/integrations/creating-nodes/build/reference/node-file-structure/) -- file and class naming rules (HIGH confidence via web search corroboration)
- [Building community nodes (n8n docs)](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/) -- package.json `n8n` block format, keyword requirements (HIGH confidence)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
