# CLI Reference

HOOK CLI now supports both:

- instance setup/diagnostics (`onboard`, `doctor`, `configure`, `env`, `allowed-hostname`)
- control-plane client operations (issues, approvals, agents, activity, dashboard)

## Base Usage

Use repo script in development:

```sh
pnpm hookai --help
```

First-time local bootstrap + run:

```sh
pnpm hookai run
```

Choose local instance:

```sh
pnpm hookai run --instance dev
```

## Deployment Modes

Mode taxonomy and design intent are documented in `doc/DEPLOYMENT-MODES.md`.

Current CLI behavior:

- `hookai onboard` and `hookai configure --section server` set deployment mode in config
- runtime can override mode with `PAPERCLIP_DEPLOYMENT_MODE`
- `hookai run` and `hookai doctor` do not yet expose a direct `--mode` flag

Canonical behavior is documented in `doc/DEPLOYMENT-MODES.md`.

Allow an authenticated/private hostname (for example custom Tailscale DNS):

```sh
pnpm hookai allowed-hostname dotta-macbook-pro
```

All client commands support:

- `--data-dir <path>`
- `--api-base <url>`
- `--api-key <token>`
- `--context <path>`
- `--profile <name>`
- `--json`

Company-scoped commands also support `--company-id <id>`.

Use `--data-dir` on any CLI command to isolate all default local state (config/context/db/logs/storage/secrets) away from `~/.hook`:

```sh
pnpm hookai run --data-dir ./tmp/hook-dev
pnpm hookai issue list --data-dir ./tmp/hook-dev
```

## Context Profiles

Store local defaults in `~/.hook/context.json`:

```sh
pnpm hookai context set --api-base http://localhost:3100 --company-id <company-id>
pnpm hookai context show
pnpm hookai context list
pnpm hookai context use default
```

To avoid storing secrets in context, set `apiKeyEnvVarName` and keep the key in env:

```sh
pnpm hookai context set --api-key-env-var-name PAPERCLIP_API_KEY
export PAPERCLIP_API_KEY=...
```

## Company Commands

```sh
pnpm hookai company list
pnpm hookai company get <company-id>
pnpm hookai company delete <company-id-or-prefix> --yes --confirm <same-id-or-prefix>
```

Examples:

```sh
pnpm hookai company delete PAP --yes --confirm PAP
pnpm hookai company delete 5cbe79ee-acb3-4597-896e-7662742593cd --yes --confirm 5cbe79ee-acb3-4597-896e-7662742593cd
```

Notes:

- Deletion is server-gated by `PAPERCLIP_ENABLE_COMPANY_DELETION`.
- With agent authentication, company deletion is company-scoped. Use the current company ID/prefix (for example via `--company-id` or `PAPERCLIP_COMPANY_ID`), not another company.

## Issue Commands

```sh
pnpm hookai issue list --company-id <company-id> [--status todo,in_progress] [--assignee-agent-id <agent-id>] [--match text]
pnpm hookai issue get <issue-id-or-identifier>
pnpm hookai issue create --company-id <company-id> --title "..." [--description "..."] [--status todo] [--priority high]
pnpm hookai issue update <issue-id> [--status in_progress] [--comment "..."]
pnpm hookai issue comment <issue-id> --body "..." [--reopen]
pnpm hookai issue checkout <issue-id> --agent-id <agent-id> [--expected-statuses todo,backlog,blocked]
pnpm hookai issue release <issue-id>
```

## Agent Commands

```sh
pnpm hookai agent list --company-id <company-id>
pnpm hookai agent get <agent-id>
pnpm hookai agent local-cli <agent-id-or-shortname> --company-id <company-id>
```

`agent local-cli` is the quickest way to run local Claude/Codex manually as a HOOK agent:

- creates a new long-lived agent API key
- installs missing HOOK skills into `~/.codex/skills` and `~/.claude/skills`
- prints `export ...` lines for `PAPERCLIP_API_URL`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_AGENT_ID`, and `PAPERCLIP_API_KEY`

Example for shortname-based local setup:

```sh
pnpm hookai agent local-cli codexcoder --company-id <company-id>
pnpm hookai agent local-cli claudecoder --company-id <company-id>
```

## Approval Commands

```sh
pnpm hookai approval list --company-id <company-id> [--status pending]
pnpm hookai approval get <approval-id>
pnpm hookai approval create --company-id <company-id> --type hire_agent --payload '{"name":"..."}' [--issue-ids <id1,id2>]
pnpm hookai approval approve <approval-id> [--decision-note "..."]
pnpm hookai approval reject <approval-id> [--decision-note "..."]
pnpm hookai approval request-revision <approval-id> [--decision-note "..."]
pnpm hookai approval resubmit <approval-id> [--payload '{"...":"..."}']
pnpm hookai approval comment <approval-id> --body "..."
```

## Activity Commands

```sh
pnpm hookai activity list --company-id <company-id> [--agent-id <agent-id>] [--entity-type issue] [--entity-id <id>]
```

## Dashboard Commands

```sh
pnpm hookai dashboard get --company-id <company-id>
```

## Heartbeat Command

`heartbeat run` now also supports context/api-key options and uses the shared client stack:

```sh
pnpm hookai heartbeat run --agent-id <agent-id> [--api-base http://localhost:3100] [--api-key <token>]
```

## Local Storage Defaults

Default local instance root is `~/.hook/instances/default`:

- config: `~/.hook/instances/default/config.json`
- embedded db: `~/.hook/instances/default/db`
- logs: `~/.hook/instances/default/logs`
- storage: `~/.hook/instances/default/data/storage`
- secrets key: `~/.hook/instances/default/secrets/master.key`

Override base home or instance with env vars:

```sh
PAPERCLIP_HOME=/custom/home PAPERCLIP_INSTANCE_ID=dev pnpm hookai run
```

## Storage Configuration

Configure storage provider and settings:

```sh
pnpm hookai configure --section storage
```

Supported providers:

- `local_disk` (default; local single-user installs)
- `s3` (S3-compatible object storage)
