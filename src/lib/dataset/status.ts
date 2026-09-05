import "server-only";

import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { datasetIncomingDirectory, datasetManifestDirectory } from "./constants";
import type { DatasetStatus } from "./types";

export type { DatasetStatus };

export function getDatasetStatus(
  rootDirectory: string = process.cwd(),
): DatasetStatus {
  const manifestDirectory = resolve(rootDirectory, datasetManifestDirectory);
  const incomingDirectory = resolve(rootDirectory, datasetIncomingDirectory);

  const manifestCount = existsSync(manifestDirectory)
    ? readdirSync(manifestDirectory).filter((name) => name.endsWith(".json"))
        .length
    : 0;

  return {
    manifestCount,
    incomingDirectoryReady: existsSync(incomingDirectory),
  };
}
