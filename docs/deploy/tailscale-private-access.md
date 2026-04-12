---
title: Tailscale Private Access
summary: Run HOOK with Tailscale-friendly host binding and connect from other devices
---

Use this when you want to access HOOK over Tailscale (or a private LAN/VPN) instead of only `localhost`.

## 1. Start HOOK in private authenticated mode

```sh
pnpm dev --bind tailnet
```

Recommended behavior:

- `PAPERCLIP_DEPLOYMENT_MODE=authenticated`
- `PAPERCLIP_DEPLOYMENT_EXPOSURE=private`
- `PAPERCLIP_BIND=tailnet`

If you want the old broad private-network behavior instead, use:

```sh
pnpm dev --bind lan
```

Legacy aliases still map to `authenticated/private + bind=lan`:

pnpm dev --authenticated-private
pnpm dev --tailscale-auth
```

## 2. Find your reachable Tailscale address

From the machine running HOOK:

```sh
tailscale ip -4
```

You can also use your Tailscale MagicDNS hostname (for example `my-macbook.tailnet.ts.net`).

## 3. Open HOOK from another device

Use the Tailscale IP or MagicDNS host with the HOOK port:

```txt
http://<tailscale-host-or-ip>:3100
```

Example:

```txt
http://my-macbook.tailnet.ts.net:3100
```

## 4. Allow custom private hostnames when needed

If you access HOOK with a custom private hostname, add it to the allowlist:

```sh
pnpm hookai allowed-hostname my-macbook.tailnet.ts.net
```

## 5. Verify the server is reachable

From a remote Tailscale-connected device:

```sh
curl http://<tailscale-host-or-ip>:3100/api/health
```

Expected result:

```json
{"status":"ok"}
```

## Troubleshooting

- Login or redirect errors on a private hostname: add it with `hookai allowed-hostname`.
- App only works on `localhost`: make sure you started with `--tailscale-auth` (or set `HOST=0.0.0.0` in private mode).
- Can connect locally but not remotely: verify both devices are on the same Tailscale network and port `3100` is reachable.
