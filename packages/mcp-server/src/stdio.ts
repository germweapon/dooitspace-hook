#!/usr/bin/env node
import { runServer } from "./index.js";

void runServer().catch((error) => {
  console.error("Failed to start HOOK MCP server:", error);
  process.exit(1);
});
