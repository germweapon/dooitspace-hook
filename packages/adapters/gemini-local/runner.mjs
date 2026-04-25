#!/usr/bin/env node
/**
 * Gemini-local HOOK runner
 * Polls the HOOK API for issues assigned to the Gemini agent and triggers wakeup.
 *
 * Usage:
 *   node runner.mjs
 *   HOOK_API_BASE=http://localhost:3100 GEMINI_API_KEY=pk_... node runner.mjs
 *
 * Environment variables:
 *   HOOK_API_BASE       HOOK server URL (default: http://localhost:3100)
 *   GEMINI_AGENT_API_KEY  Bearer token for Gemini agent (required)
 *   GEMINI_AGENT_ID     Gemini agent UUID (required)
 *   HOOK_COMPANY_ID     Company UUID (required)
 *   POLL_INTERVAL_MS    Poll interval in ms (default: 15000)
 */

const API_BASE = process.env.HOOK_API_BASE ?? "http://localhost:3100";
const AGENT_API_KEY = process.env.GEMINI_AGENT_API_KEY ?? "pk_fef0d4165d3e862e609774c36c349f9aa6f454f2d7b25df03d809a1bd2a6c54c";
const AGENT_ID = process.env.GEMINI_AGENT_ID ?? "a1225ba4-ebe2-4606-8883-66d71a10965b";
const COMPANY_ID = process.env.HOOK_COMPANY_ID ?? "6e4cff1d-7f19-4ff7-aca7-a03746cf792b";
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 15_000;
const WAKEUP_TIMEOUT_MS = 120_000;

const HEADERS = {
  Authorization: `Bearer ${AGENT_API_KEY}`,
  "Content-Type": "application/json",
};

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers: { ...HEADERS, ...opts.headers } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${path}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function getPendingIssues() {
  const issues = await apiFetch(
    `/api/companies/${COMPANY_ID}/issues?assigneeAgentId=${AGENT_ID}`,
  );
  return Array.isArray(issues)
    ? issues.filter((i) => i.status === "todo" || i.status === "in_progress")
    : [];
}

async function triggerWakeup() {
  return apiFetch(`/api/agents/${AGENT_ID}/wakeup`, {
    method: "POST",
    body: JSON.stringify({ source: "assignment", triggerDetail: "manual" }),
  });
}

async function waitForRun(runId) {
  const TERMINAL = new Set(["succeeded", "failed", "cancelled", "timed_out"]);
  const deadline = Date.now() + WAKEUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await sleep(2000);
    const run = await apiFetch(`/api/heartbeat-runs/${runId}`).catch(() => null);
    if (!run) break;
    if (TERMINAL.has(run.status)) {
      return run;
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timestamp() {
  return new Date().toISOString().slice(11, 19);
}

let activeRunId = null;

async function poll() {
  let pending;
  try {
    pending = await getPendingIssues();
  } catch (err) {
    console.error(`[${timestamp()}] ⚠️  API unreachable: ${err.message}`);
    return;
  }

  if (pending.length === 0) {
    return;
  }

  console.log(`[${timestamp()}] 📋 ${pending.length} pending issue(s): ${pending.map((i) => i.identifier).join(", ")}`);

  try {
    const run = await triggerWakeup();
    if (run.status === "skipped") {
      console.log(`[${timestamp()}] ⏭️  Wakeup skipped (agent may already be running)`);
      return;
    }

    activeRunId = run.id;
    console.log(`[${timestamp()}] 🚀 Run started: ${run.id}`);

    const result = await waitForRun(run.id);
    activeRunId = null;

    if (!result) {
      console.log(`[${timestamp()}] ⏱  Run timed out after ${WAKEUP_TIMEOUT_MS / 1000}s`);
    } else if (result.status === "succeeded") {
      console.log(`[${timestamp()}] ✅ Run succeeded`);
    } else {
      console.log(`[${timestamp()}] ❌ Run ${result.status}: ${result.error ?? "no error detail"}`);
    }
  } catch (err) {
    activeRunId = null;
    console.error(`[${timestamp()}] ❌ Wakeup error: ${err.message}`);
  }
}

async function main() {
  console.log(`[${timestamp()}] 🤖 Gemini runner started`);
  console.log(`[${timestamp()}]    API: ${API_BASE}`);
  console.log(`[${timestamp()}]    Agent: ${AGENT_ID}`);
  console.log(`[${timestamp()}]    Poll interval: ${POLL_INTERVAL_MS}ms`);

  // Graceful shutdown
  for (const sig of ["SIGINT", "SIGTERM"]) {
    process.on(sig, () => {
      console.log(`\n[${timestamp()}] 🛑 Shutting down (${sig})`);
      process.exit(0);
    });
  }

  // Initial poll immediately
  await poll();

  // Then poll on interval
  setInterval(poll, POLL_INTERVAL_MS);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
