# n8n-nodes-hindsight

## What This Is

An n8n community node package that wraps the Hindsight REST API by Vectorize.io. It gives n8n workflow builders access to Hindsight's AI memory system — storing, searching, and reflecting on memories organized into banks — directly from their automation workflows. The package targets n8n 1.0+ and follows all official community node conventions.

## Core Value

Expose every useful Hindsight API operation to n8n workflow builders with clean UX — required fields upfront, optional fields in "Additional Fields" collections — so users can integrate persistent AI memory into any automation without leaving n8n.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Scaffold from official n8n-nodes-starter repo structure
- [ ] TypeScript throughout, package name `n8n-nodes-hindsight`
- [ ] Credential type: Hindsight API (API Key header + configurable Base URL, default `http://localhost:8888`)
- [ ] Resource group: Bank — create, list, get, delete, update configuration (mission, directives, disposition)
- [ ] Resource group: Memory — retain (store), recall (search), reflect (generate response)
- [ ] Every API parameter exposed per operation (required fields + Additional Fields collection for optional)
- [ ] All operations return raw JSON response from the API
- [ ] Programmatic node style (INodeType.execute() with httpRequest)
- [ ] n8nNodesApiVersion, nodes, and credentials entries in package.json n8n block
- [ ] Passes n8n linter (`npm run lint`)
- [ ] README with install instructions, credential setup, and one usage example per operation
- [ ] Follow all naming, file structure, and package.json conventions from starter repo and official docs
- [ ] Target n8n version 1.0+

### Out of Scope

- Tests — not required for v1
- Declarative/HTTP-request node style — programmatic chosen for flexibility
- n8n Cloud publishing — community install only for now
- Webhook/trigger node — Hindsight is request/response only
- Multiple node files — single Hindsight node with resource/operation pattern

## Context

- **Hindsight** is an AI memory system by Vectorize.io with three core operations: retain (store memories), recall (search memories), and reflect (generate disposition-aware responses from memories)
- Memories are organized into **banks** which have configuration (mission, directives, disposition)
- The API supports metadata, memory type overrides, effort levels, and other advanced parameters
- Hindsight can be self-hosted (default localhost:8888) or used via Hindsight Cloud
- n8n community nodes are installed via `npm install` in the n8n custom extensions directory
- The official n8n-nodes-starter repo provides the canonical scaffolding (tsconfig, eslint, package.json structure)
- API docs at https://hindsight.vectorize.io; source at https://github.com/vectorize-io/hindsight

## Constraints

- **Scaffolding**: Must start from n8n-nodes-starter repo patterns, not from scratch
- **Naming conventions**: Must follow n8n's exact naming rules (file names, class names, package.json entries)
- **Linting**: Must pass `npm run lint` with n8n's eslint config
- **Package structure**: n8n block in package.json must declare nodes and credentials paths correctly
- **Auth**: API key sent as header (exact header name per Hindsight docs)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Programmatic node style | Full control over request construction; better for complex optional params and dynamic body building | -- Pending |
| Single node with resource/operation pattern | Bank + Memory resources in one node keeps the UX simple and discoverable | -- Pending |
| Comprehensive API coverage | User wants every useful endpoint, not a minimal wrapper | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization*
