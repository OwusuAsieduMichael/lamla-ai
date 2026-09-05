import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vitest", "run", "src/lib/evaluation", "src/lib/ai/answer.test.ts"],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(
  "Grounding evaluation passed. Empty corpora and missing providers must refuse.",
);
