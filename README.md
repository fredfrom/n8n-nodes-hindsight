# n8n-nodes-hindsight

[![npm version](https://img.shields.io/npm/v/n8n-nodes-hindsight.svg)](https://www.npmjs.com/package/n8n-nodes-hindsight)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An [n8n](https://n8n.io/) community node package for the [Hindsight](https://hindsight.vectorize.io/) AI memory API by [Vectorize.io](https://www.vectorize.io/).

Give your n8n workflows persistent AI memory -- store, search, and reflect on memories organized into banks.

46 operations across 8 resources. Works as a regular node or as a tool for AI agents (`usableAsTool: true`).

## Installation

### Community Nodes (recommended)

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-hindsight`
5. Agree to the risks and install

### Manual installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-hindsight
```

Restart n8n after installation.

## Credentials

1. Go to **Settings > Credentials > Add Credential**
2. Search for **Hindsight API**
3. Configure:
   - **API Key** -- Your Hindsight API key (leave empty for self-hosted without auth)
   - **Base URL** -- Defaults to `http://localhost:8888`. For Hindsight Cloud use `https://api.hindsight.vectorize.io`
4. Click **Test** to verify, then **Save**

## Resources and Operations

### Bank

Manage memory banks -- top-level containers for all Hindsight data.

| Operation | Description |
|-----------|-------------|
| Clear Observations | Remove all observations from a bank |
| Consolidate | Trigger observation synthesis |
| Create or Update | Create or update a bank (upsert) |
| Delete | Delete a bank and all its data |
| Get Config | Get resolved bank configuration |
| Get Profile | Get bank profile and disposition |
| Get Stats | Get bank statistics |
| List | List all banks |
| List Tags | List tags with counts |
| Reset Config | Reset config to server defaults |
| Update Config | Update configuration overrides |
| Update Disposition | Set personality traits (skepticism, literalism, empathy) |

### Memory

Store and retrieve memories.

| Operation | Description |
|-----------|-------------|
| Clear | Delete memories (optional type filter) |
| Clear Observations | Clear observations for a specific memory |
| Get | Get a specific memory by ID |
| List | List memories with optional filtering |
| Recall | Semantic search across memories |
| Reflect | AI-generated response grounded in memories |
| Retain | Store new content as a memory |

### Directive

Rules that shape how Hindsight processes and reflects.

| Operation | Description |
|-----------|-------------|
| Create | Create a directive |
| Delete | Delete a directive |
| Get | Get a directive |
| List | List all directives in a bank |
| Update | Update a directive |

### Mental Model

Persistent, auto-refreshing knowledge summaries.

| Operation | Description |
|-----------|-------------|
| Create | Create a mental model |
| Delete | Delete a mental model |
| Get | Get a mental model |
| Get History | Get revision history |
| List | List mental models in a bank |
| Refresh | Trigger a manual refresh |
| Update | Update a mental model |

### Document

Manage source documents that group related memories.

| Operation | Description |
|-----------|-------------|
| Delete | Delete a document and its memories |
| Get | Get document details |
| List | List documents with search and tag filters |
| Update Tags | Update document tags |

### Entity

Browse entities extracted from memories.

| Operation | Description |
|-----------|-------------|
| Get | Get entity details |
| List | List entities in a bank |

### Operation

Track async jobs (retain, consolidation).

| Operation | Description |
|-----------|-------------|
| Cancel | Cancel a pending operation |
| Get | Get operation status |
| List | List operations in a bank |
| Retry | Retry a failed operation |

### Webhook

Event-driven notifications from Hindsight.

| Operation | Description |
|-----------|-------------|
| Create | Register a webhook |
| Delete | Delete a webhook |
| List | List webhooks in a bank |
| List Deliveries | View delivery attempts |
| Update | Update a webhook |

## Test Workflow

A test workflow is included at [`examples/test-workflow.json`](examples/test-workflow.json). Import it into n8n to verify all operations work with your Hindsight instance.

The workflow tests: Bank Create --> List --> Get Profile --> Get Stats --> Memory Retain --> Recall --> Reflect --> Directive Create --> Bank Delete.

## Links

- [Hindsight API Documentation](https://hindsight.vectorize.io/)
- [Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
