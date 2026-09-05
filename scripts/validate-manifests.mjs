import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";

const manifestDirectory = resolve(process.cwd(), "datasets/manifests");

if (!existsSync(manifestDirectory)) {
  console.log("No datasets/manifests directory. Collection is empty (valid).");
  process.exit(0);
}

const files = readdirSync(manifestDirectory).filter(
  (name) => extname(name) === ".json",
);

if (files.length === 0) {
  console.log("No resource manifests. Collection is empty (valid).");
  process.exit(0);
}

const errors = [];

for (const fileName of files) {
  const filePath = resolve(manifestDirectory, fileName);
  let payload;

  try {
    payload = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    errors.push(`${fileName}: invalid JSON`);
    continue;
  }

  if (payload?.example === true) {
    errors.push(`${fileName}: example fixtures must not live in datasets/manifests`);
  }

  if (payload?.schemaVersion !== 1) {
    errors.push(`${fileName}: schemaVersion must be 1`);
  }

  if (typeof payload?.id !== "string" || payload.id.length === 0) {
    errors.push(`${fileName}: id is required`);
  }

  if (typeof payload?.sourceAttribution !== "string" || !payload.sourceAttribution.trim()) {
    errors.push(`${fileName}: sourceAttribution is required`);
  }

  if (payload?.authorization?.status === "granted") {
    if (!payload.authorization.authorizedBy) {
      errors.push(`${fileName}: granted authorization requires authorizedBy`);
    }

    if (!payload.authorization.authorizedAt) {
      errors.push(`${fileName}: granted authorization requires authorizedAt`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }

  process.exit(1);
}

console.log(`Validated ${files.length} resource manifest(s).`);
