import pc from "picocolors";

const HOOK_ART = [
  "██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗",
  "██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝",
  "███████║██║   ██║██║   ██║█████╔╝ ",
  "██╔══██║██║   ██║██║   ██║██╔═██╗ ",
  "██║  ██║╚██████╔╝╚██████╔╝██║  ██╗",
  "╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝",
] as const;

const TAGLINE = "Dooitspace HOOK — Agent Orchestration Platform";

export function printHookCliBanner(): void {
  const lines = [
    "",
    ...HOOK_ART.map((line) => pc.cyan(line)),
    pc.blue("  ─────────────────────────────────────"),
    pc.bold(pc.white(`  ${TAGLINE}`)),
    "",
  ];

  console.log(lines.join("\n"));
}
