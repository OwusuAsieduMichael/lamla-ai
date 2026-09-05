import "server-only";

import { getDatasetStatus } from "@/lib/dataset/status";

import type { IngestionStatus } from "./types";

export type { IngestionStatus };

/**
 * Reports pipeline readiness only.
 * No authorized incoming files are present, so nothing is processed.
 */
export function getIngestionStatus(
  rootDirectory: string = process.cwd(),
): IngestionStatus {
  const datasetStatus = getDatasetStatus(rootDirectory);

  return {
    pipelineReady: true,
    authorizedFilesToProcess: datasetStatus.manifestCount,
  };
}
