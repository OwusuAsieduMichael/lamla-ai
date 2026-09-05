export const ingestionJobStatuses = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "skipped",
] as const;

export const ingestionSkipReasons = [
  "authorization_not_granted",
  "missing_source_attribution",
  "missing_incoming_file",
  "unsafe_storage_path",
  "checksum_mismatch",
  "mime_deferred_to_vision",
  "pdf_extractor_not_wired",
  "unsupported_mime",
] as const;

export type IngestionJobStatus = (typeof ingestionJobStatuses)[number];
export type IngestionSkipReason = (typeof ingestionSkipReasons)[number];
