---
title: Setup Commands
summary: Onboard, run, doctor, and configure
---

Instance setup and diagnostics commands.

## `hookai run`

One-command bootstrap and start:

```sh
pnpm hookai run
```

Does:

1. Auto-onboards if config is missing
2. Runs `hookai doctor` with repair enabled
3. Starts the server when checks pass

Choose a specific instance:

```sh
pnpm hookai run --instance dev
```

## `hookai onboard`

Interactive first-time setup:

```sh
pnpm hookai onboard
```

If HOOK is already configured, rerunning `onboard` keeps the existing config in place. Use `hookai configure` to change settings on an existing install.

First prompt:

1. `Quickstart` (recommended): local defaults (embedded database, no LLM provider, local disk storage, default secrets)
2. `Advanced setup`: full interactive configuration

Start immediately after onboarding:

```sh
pnpm hookai onboard --run
```

Non-interactive defaults + immediate start (opens browser on server listen):

```sh
pnpm hookai onboard --yes
```

On an existing install, `--yes` now preserves the current config and just starts HOOK with that setup.

## `hookai doctor`

Health checks with optional auto-repair:

```sh
pnpm hookai doctor
pnpm hookai doctor --repair
```

Validates:

- Server configuration
- Database connectivity
- Secrets adapter configuration
- Storage configuration
- Missing key files

## `hookai configure`

Update configuration sections:

```sh
pnpm hookai configure --section server
pnpm hookai configure --section secrets
pnpm hookai configure --section storage
```

## `hookai env`

Show resolved environment configuration:

```sh
pnpm hookai env
```

## `hookai allowed-hostname`

Allow a private hostname for authenticated/private mode:

```sh
pnpm hookai allowed-hostname my-tailscale-host
```

## Local Storage Paths

| Data | Default Path |
|------|-------------|
| Config | `~/.hook/instances/default/config.json` |
| Database | `~/.hook/instances/default/db` |
| Logs | `~/.hook/instances/default/logs` |
| Storage | `~/.hook/instances/default/data/storage` |
| Secrets key | `~/.hook/instances/default/secrets/master.key` |

Override with:

```sh
PAPERCLIP_HOME=/custom/home PAPERCLIP_INSTANCE_ID=dev pnpm hookai run
```

Or pass `--data-dir` directly on any command:

```sh
pnpm hookai run --data-dir ./tmp/hook-dev
pnpm hookai doctor --data-dir ./tmp/hook-dev
```
