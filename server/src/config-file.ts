import fs from "node:fs";
import { paperclipConfigSchema, type HOOKConfig } from "@paperclipai/shared";
import { resolveHOOKConfigPath } from "./paths.js";

export function readConfigFile(): HOOKConfig | null {
  const configPath = resolveHOOKConfigPath();

  if (!fs.existsSync(configPath)) return null;

  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return paperclipConfigSchema.parse(raw);
  } catch {
    return null;
  }
}
