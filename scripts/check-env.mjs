import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const publicNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

const serverOptionalNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "GEMINI_API_KEY",
  "AI_PROVIDER",
];

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return {};
  }

  const values = {};

  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const name = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    values[name] = value;
  }

  return values;
}

function isSet(source, name) {
  const value = source[name] ?? process.env[name];
  return typeof value === "string" && value.length > 0;
}

const source = loadLocalEnv();

console.log("LAMLA env check (presence only; values are never printed)");

for (const name of publicNames) {
  console.log(`${name}: ${isSet(source, name) ? "set" : "missing"}`);
}

for (const name of serverOptionalNames) {
  console.log(`${name}: ${isSet(source, name) ? "set" : "unset (optional until needed)"}`);
}
