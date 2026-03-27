# n8n-nodes-hindsight

An [n8n](https://n8n.io/) community node package for the [Hindsight](https://www.vectorize.io/) AI memory API by Vectorize.io.

This node gives n8n workflow builders access to Hindsight's AI memory system -- storing, searching, and reflecting on memories organized into banks -- directly from automation workflows.

## Installation

Install in your n8n instance's custom extensions directory:

```bash
cd ~/.n8n/custom
npm install n8n-nodes-hindsight
```

Then restart n8n. The Hindsight node will appear in the node palette.

## Credential Setup

1. In n8n, go to **Settings > Credentials > Add Credential**.
2. Search for **Hindsight API** and select it.
3. Fill in the fields:
   - **API Key** -- Your Hindsight API key. Leave empty for self-hosted instances running without authentication.
   - **Base URL** -- The Hindsight API base URL. Defaults to `http://localhost:8888`.
4. Click **Test** to verify the connection (calls `GET /v1/default/banks`).
5. Click **Save**.

## Resources and Operations

### Bank

Manage memory banks -- the top-level containers for all Hindsight data.

| Operation | Description |
|-----------|-------------|
| Clear Observations | Remove all observations from a bank |
| Consolidate | Trigger observation synthesis |
| Create or Update | Create a new bank or update an existing one |
| Delete | Delete a bank and all its data |
| Get Config | Get resolved bank configuration |
| Get Profile | Get bank profile |
| Get Stats | Get bank statistics |
| List | List all banks |
| List Tags | List tags with counts |
| Reset Config | Reset bank config to server defaults |
| Update Config | Update bank configuration overrides |
| Update Disposition | Set personality traits (skepticism, literalism, empathy) |

**Example -- Create a bank:**
1. Add the Hindsight node to your workflow.
2. Select **Resource: Bank** and **Operation: Create or Update**.
3. Enter a **Bank ID** (e.g., `my-project`).
4. Under **Additional Fields**, add a **Name** and **Mission**.
5. Execute the node.

### Memory

Store and retrieve memories using retain, recall, and reflect.

| Operation | Description |
|-----------|-------------|
| Clear | Delete all memories in a bank (optional type filter) |
| Clear Observations | Clear observations for a specific memory |
| Get | Get a specific memory by ID |
| List | List memories with optional filtering |
| Recall | Semantic search across memories |
| Reflect | AI-generated reflection on memories |
| Retain | Store new content as a memory |

**Example -- Retain and Recall:**
1. **Retain:** Select **Resource: Memory**, **Operation: Retain**. Enter your **Bank ID** and the **Content** to store. Optionally add tags and metadata under **Additional Fields**.
2. **Recall:** Select **Resource: Memory**, **Operation: Recall**. Enter your **Bank ID** and a **Query**. The API returns semantically relevant memories.
3. **Reflect:** Select **Resource: Memory**, **Operation: Reflect**. Enter your **Bank ID** and a **Query**. The API returns an AI-synthesized reflection based on stored memories.

### Directive

Create rules that shape how Hindsight processes and reflects on memories.

| Operation | Description |
|-----------|-------------|
| Create | Create a new directive |
| Delete | Delete a directive |
| Get | Get a specific directive |
| List | List all directives in a bank |
| Update | Update a directive |

**Example -- Create a directive:**
1. Select **Resource: Directive**, **Operation: Create**.
2. Enter the **Bank ID**, a **Name** (e.g., `tone-guide`), and the **Content** (e.g., `Always respond in a professional tone`).
3. Optionally set **Priority** and **Tags** under **Additional Fields**.

### Mental Model

Define persistent, auto-refreshing knowledge summaries derived from memories.

| Operation | Description |
|-----------|-------------|
| Create | Create a new mental model |
| Delete | Delete a mental model |
| Get | Get a specific mental model |
| Get History | Get revision history |
| List | List all mental models in a bank |
| Refresh | Trigger a manual refresh |
| Update | Update a mental model |

**Example -- Create a mental model:**
1. Select **Resource: Mental Model**, **Operation: Create**.
2. Enter the **Bank ID**, a **Name** (e.g., `customer-preferences`), and a **Source Query** (e.g., `What are the customer's preferences and habits?`).
3. The model auto-refreshes after consolidation by default.

### Document

Manage documents that group related memories.

| Operation | Description |
|-----------|-------------|
| Delete | Delete a document |
| Get | Get a specific document |
| List | List documents with optional search and tag filters |
| Update Tags | Update tags on a document |

**Example -- List documents with a tag filter:**
1. Select **Resource: Document**, **Operation: List**.
2. Enter the **Bank ID**.
3. Under **Additional Fields**, enter **Tags** (e.g., `meeting-notes`) and set **Tags Match** to `all` or `any`.

### Entity

View entities that Hindsight has automatically extracted from memories.

| Operation | Description |
|-----------|-------------|
| Get | Get a specific entity |
| List | List entities in a bank |

**Example -- List entities:**
1. Select **Resource: Entity**, **Operation: List**.
2. Enter the **Bank ID**.
3. Optionally set **Limit** and **Offset** under **Additional Fields** for pagination.

### Operation

Monitor and manage async operations (retain jobs, consolidation tasks).

| Operation | Description |
|-----------|-------------|
| Cancel | Cancel a pending operation |
| Get | Get a specific operation |
| List | List operations in a bank |
| Retry | Retry a failed operation |

**Example -- Monitor operations:**
1. Select **Resource: Operation**, **Operation: List**.
2. Enter the **Bank ID**.
3. Review the status of recent async tasks.

### Webhook

Register webhooks to receive event notifications from Hindsight.

| Operation | Description |
|-----------|-------------|
| Create | Register a new webhook |
| Delete | Delete a webhook |
| List | List all webhooks in a bank |
| List Deliveries | View delivery attempts for a webhook |
| Update | Update a webhook |

**Example -- Create a webhook:**
1. Select **Resource: Webhook**, **Operation: Create**.
2. Enter the **Bank ID** and the delivery **URL** (e.g., `https://example.com/hook`).
3. Under **Additional Fields**, optionally set **Event Types** (`consolidation.completed`, `retain.completed`), a **Secret** for HMAC verification, and **HTTP Config** for custom method, timeout, headers, or query parameters.

## API Documentation

For full API details, see the [Hindsight API documentation](https://docs.vectorize.io/).

## License

MIT
