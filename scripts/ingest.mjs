import { existsSync, readdirSync } from "node:fs";
import { extname, resolve } from "node:path";

const incomingDirectory = resolve(process.cwd(), "datasets/incoming");
const manifestDirectory = resolve(process.cwd(), "datasets/manifests");

const incomingFiles = existsSync(incomingDirectory)
  ? readdirSync(incomingDirectory).filter((name) => name !== ".gitkeep" && name !== "README.md")
  : [];

const manifests = existsSync(manifestDirectory)
  ? readdirSync(manifestDirectory).filter((name) => extname(name) === ".json")
  : [];

console.log("LAMLA ingestion (Phase 3)");
console.log(`Manifests: ${manifests.length}`);
console.log(`Incoming files: ${incomingFiles.length}`);

if (manifests.length === 0 || incomingFiles.length === 0) {
  console.log("Nothing to ingest. Authorized granted sources are required first.");
  process.exit(0);
}

console.log("Authorized files are present. Run the TypeScript pipeline from application code.");
process.exit(0);
