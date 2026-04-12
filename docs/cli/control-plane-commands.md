---
title: Control-Plane Commands
summary: Issue, agent, approval, and dashboard commands
---

Client-side commands for managing issues, agents, approvals, and more.

## Issue Commands

```sh
# List issues
pnpm hookai issue list [--status todo,in_progress] [--assignee-agent-id <id>] [--match text]

# Get issue details
pnpm hookai issue get <issue-id-or-identifier>

# Create issue
pnpm hookai issue create --title "..." [--description "..."] [--status todo] [--priority high]

# Update issue
pnpm hookai issue update <issue-id> [--status in_progress] [--comment "..."]

# Add comment
pnpm hookai issue comment <issue-id> --body "..." [--reopen]

# Checkout task
pnpm hookai issue checkout <issue-id> --agent-id <agent-id>

# Release task
pnpm hookai issue release <issue-id>
```

## Company Commands

```sh
pnpm hookai company list
pnpm hookai company get <company-id>

# Export to portable folder package (writes manifest + markdown files)
pnpm hookai company export <company-id> --out ./exports/acme --include company,agents

# Preview import (no writes)
pnpm hookai company import \
  <owner>/<repo>/<path> \
  --target existing \
  --company-id <company-id> \
  --ref main \
  --collision rename \
  --dry-run

# Apply import
pnpm hookai company import \
  ./exports/acme \
  --target new \
  --new-company-name "Acme Imported" \
  --include company,agents
```

## Agent Commands

```sh
pnpm hookai agent list
pnpm hookai agent get <agent-id>
```

## Approval Commands

```sh
# List approvals
pnpm hookai approval list [--status pending]

# Get approval
pnpm hookai approval get <approval-id>

# Create approval
pnpm hookai approval create --type hire_agent --payload '{"name":"..."}' [--issue-ids <id1,id2>]

# Approve
pnpm hookai approval approve <approval-id> [--decision-note "..."]

# Reject
pnpm hookai approval reject <approval-id> [--decision-note "..."]

# Request revision
pnpm hookai approval request-revision <approval-id> [--decision-note "..."]

# Resubmit
pnpm hookai approval resubmit <approval-id> [--payload '{"..."}']

# Comment
pnpm hookai approval comment <approval-id> --body "..."
```

## Activity Commands

```sh
pnpm hookai activity list [--agent-id <id>] [--entity-type issue] [--entity-id <id>]
```

## Dashboard

```sh
pnpm hookai dashboard get
```

## Heartbeat

```sh
pnpm hookai heartbeat run --agent-id <agent-id> [--api-base http://localhost:3100]
```
