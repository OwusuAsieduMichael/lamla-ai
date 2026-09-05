import { getDatasetStatus } from "@/lib/dataset/status";
import { getEnvStatus } from "@/lib/env/status";
import { hasProviderKey, resolveModelProvider } from "@/lib/ai/providers";
import { getIngestionStatus } from "@/lib/ingestion/status";

export type CapabilityStatus = {
  organizationReady: boolean;
  corpusReady: boolean;
  ingestionReady: boolean;
  retrievalReady: boolean;
  groundedAiReady: boolean;
};

export function getCapabilityStatus(
  rootDirectory: string = process.cwd(),
): CapabilityStatus {
  const envStatus = getEnvStatus();
  const datasetStatus = getDatasetStatus(rootDirectory);
  const ingestionStatus = getIngestionStatus(rootDirectory);
  const provider = resolveModelProvider();

  return {
    organizationReady: true,
    corpusReady: datasetStatus.manifestCount > 0,
    ingestionReady: ingestionStatus.pipelineReady,
    retrievalReady: datasetStatus.manifestCount > 0,
    groundedAiReady:
      datasetStatus.manifestCount > 0 &&
      envStatus.supabasePublicConfigured &&
      envStatus.aiProviderConfigured &&
      hasProviderKey(provider),
  };
}
