import { createDb } from "./client.js";
import { companies, agents, goals, projects, issues } from "./schema/index.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const db = createDb(url);

console.log("Seeding database with Dooitspace team data...");

// ── Company ────────────────────────────────────────────────────────────────
const [company] = await db
  .insert(companies)
  .values({
    name: "Dooitspace",
    description: "AI-native autonomous company. Agents ship products, trade markets, and grow channels.",
    status: "active",
    budgetMonthlyCents: 200000, // $2,000/mo
  })
  .returning();

// ── Agents ─────────────────────────────────────────────────────────────────
// Dairs (CEO / Jarvis) — top-level orchestrator
const [dairs] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Dairs",
    role: "ceo",
    title: "AI Representative (Jarvis)",
    status: "idle",
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["dairs online"] },
    budgetMonthlyCents: 20000,
  })
  .returning();

// Daniel — Build Team Leader / PO
const [daniel] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Daniel",
    role: "engineer",
    title: "Build Team Leader / PO",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["daniel ready"] },
    budgetMonthlyCents: 20000,
  })
  .returning();

// Kai — Alpha Team Leader (trading)
const [kai] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Kai",
    role: "analyst",
    title: "Alpha Team Leader (Trading)",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["kai ready"] },
    budgetMonthlyCents: 30000,
  })
  .returning();

// Quinn — Marketing Team Leader
const [quinn] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Quinn",
    role: "marketer",
    title: "Marketing Team Leader (@germweapon channel)",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["quinn ready"] },
    budgetMonthlyCents: 15000,
  })
  .returning();

// Sol — Studio Team Leader
const [sol] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Sol",
    role: "creator",
    title: "Studio Team Leader (@newsdobogi channel)",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["sol ready"] },
    budgetMonthlyCents: 15000,
  })
  .returning();

// Ivy — New Business Pipeline
const [ivy] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Ivy",
    role: "researcher",
    title: "New Business Pipeline",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["ivy ready"] },
    budgetMonthlyCents: 10000,
  })
  .returning();

// Woods — QA / Monitoring
const [woods] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Woods",
    role: "qa",
    title: "QA & Data Analyst",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["woods ready"] },
    budgetMonthlyCents: 10000,
  })
  .returning();

// Vera — Audit Lead
const [vera] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Vera",
    role: "auditor",
    title: "Audit Lead (Security & Governance)",
    status: "idle",
    reportsTo: dairs!.id,
    adapterType: "process",
    adapterConfig: { command: "echo", args: ["vera ready"] },
    budgetMonthlyCents: 10000,
  })
  .returning();

// ── Goals ──────────────────────────────────────────────────────────────────
const [goalProduct] = await db
  .insert(goals)
  .values({
    companyId: company!.id,
    title: "Ship AI-Powered Products",
    description: "Launch Bultoon, Mathpedia, and product-detail-page agent to market",
    level: "company",
    status: "active",
    ownerAgentId: daniel!.id,
  })
  .returning();

const [goalTrading] = await db
  .insert(goals)
  .values({
    companyId: company!.id,
    title: "Generate Trading Alpha",
    description: "Run live coin/stock trading with consistent positive returns",
    level: "company",
    status: "active",
    ownerAgentId: kai!.id,
  })
  .returning();

const [goalChannel] = await db
  .insert(goals)
  .values({
    companyId: company!.id,
    title: "Grow YouTube Channels",
    description: "Scale @germweapon and @newsdobogi to consistent monthly revenue",
    level: "company",
    status: "active",
    ownerAgentId: quinn!.id,
  })
  .returning();

// ── Projects ───────────────────────────────────────────────────────────────
const [projBultoon] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goalProduct!.id,
    name: "Bultoon App",
    description: "Webtoon comic app — design system token sync across Figma files",
    status: "in_progress",
    leadAgentId: daniel!.id,
  })
  .returning();

const [projMathpedia] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goalProduct!.id,
    name: "Mathpedia Grading App",
    description: "Math exam scan/grade/stats PWA — Vite + React + Supabase + Vercel",
    status: "in_progress",
    leadAgentId: daniel!.id,
  })
  .returning();

const [projDetailPage] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goalProduct!.id,
    name: "Product Detail Page Agent",
    description: "5-agent system for auto-generating e-commerce product pages",
    status: "in_progress",
    leadAgentId: quinn!.id,
  })
  .returning();

const [projJarvis] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goalProduct!.id,
    name: "Jarvis Automation System",
    description: "Discord ↔ Claude Code integration, LaunchAgent scheduling, multi-agent orchestration",
    status: "in_progress",
    leadAgentId: dairs!.id,
  })
  .returning();

const [projTrading] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goalTrading!.id,
    name: "Alpha Trading",
    description: "Live coin + stock trading — Kai leads Turing·Maya·Warren·Atlas·Venn·Argus·Ronan·Sigrid (8 agents)",
    status: "in_progress",
    leadAgentId: kai!.id,
  })
  .returning();

const [projShorts] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goalChannel!.id,
    name: "YouTube Shorts Pipeline",
    description: "Fact-check shorts for @newsdobogi + HyperFrames repo intros for @germweapon",
    status: "in_progress",
    leadAgentId: sol!.id,
  })
  .returning();

// ── Issues ─────────────────────────────────────────────────────────────────
await db.insert(issues).values([
  // Jarvis system
  {
    companyId: company!.id,
    projectId: projJarvis!.id,
    goalId: goalProduct!.id,
    title: "Migrate claude -p to Anthropic SDK",
    description: "claude -p CLI deprecated 2026-06-15. Migrate jarvis_worker.py + dreaming-agent.py to SDK. Planned: 2026-06-10.",
    status: "todo",
    priority: "high",
    assigneeAgentId: daniel!.id,
    createdByAgentId: dairs!.id,
  },
  {
    companyId: company!.id,
    projectId: projJarvis!.id,
    goalId: goalProduct!.id,
    title: "Missing Report Auto-Detect System",
    description: "missing-report-detector.py + LaunchAgent (23:35 daily). Pings team channels on unreported days.",
    status: "done",
    priority: "high",
    assigneeAgentId: woods!.id,
    createdByAgentId: dairs!.id,
  },
  {
    companyId: company!.id,
    projectId: projJarvis!.id,
    goalId: goalProduct!.id,
    title: "Performance Tracker (Agent Reward/Penalty)",
    description: "performance-tracker.py — tracks KPIs, triggers warnings, escalates to termination. Supabase DDL pending manual run.",
    status: "in_progress",
    priority: "high",
    assigneeAgentId: vera!.id,
    createdByAgentId: dairs!.id,
  },
  {
    companyId: company!.id,
    projectId: projJarvis!.id,
    goalId: goalProduct!.id,
    title: "agent_warnings Supabase Table DDL",
    description: "Execute CREATE TABLE agent_warnings once manually in Supabase dashboard.",
    status: "todo",
    priority: "medium",
    assigneeAgentId: daniel!.id,
    createdByAgentId: dairs!.id,
  },
  // Bultoon
  {
    companyId: company!.id,
    projectId: projBultoon!.id,
    goalId: goalProduct!.id,
    title: "Figma Design Token Sync",
    description: "Sync design tokens across 3 Bultoon Figma files.",
    status: "in_progress",
    priority: "medium",
    assigneeAgentId: daniel!.id,
    createdByAgentId: daniel!.id,
  },
  // Trading
  {
    companyId: company!.id,
    projectId: projTrading!.id,
    goalId: goalTrading!.id,
    title: "Live Trading — Coin & Stock Bot",
    description: "Real-money trading live since 2026-04-21. Swing strategy, small position sizes.",
    status: "in_progress",
    priority: "high",
    assigneeAgentId: kai!.id,
    createdByAgentId: kai!.id,
  },
  // YouTube
  {
    companyId: company!.id,
    projectId: projShorts!.id,
    goalId: goalChannel!.id,
    title: "Fact-Check Shorts (@newsdobogi)",
    description: "Weekly fact-check shorts pipeline via Sol + Ray/Remy studio team.",
    status: "in_progress",
    priority: "medium",
    assigneeAgentId: sol!.id,
    createdByAgentId: sol!.id,
  },
  {
    companyId: company!.id,
    projectId: projShorts!.id,
    goalId: goalChannel!.id,
    title: "HyperFrames Repo Intro Videos (@germweapon)",
    description: "NotebookLM AI Video Overview + GitHub repo intro videos via Quinn.",
    status: "in_progress",
    priority: "medium",
    assigneeAgentId: quinn!.id,
    createdByAgentId: quinn!.id,
  },
]);

console.log("Seed complete — Dooitspace team data loaded.");
process.exit(0);
