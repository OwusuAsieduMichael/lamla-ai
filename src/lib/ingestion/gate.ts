import type { ResourceManifest } from "@/lib/dataset/schemas";
import {
  allowedResourceMimeTypes,
  type AllowedResourceMimeType,
} from "@/lib/dataset/constants";
import { assertSafeRelativePath } from "@/lib/dataset/paths";

import type { IngestionSkipReason } from "./enums";

export type IncomingFileMeta = {
  exists: boolean;
  mimeType: string | null;
  checksumSha256: string | null;
};

export type IngestDecision =
  | { ok: true; mimeType: (typeof allowedResourceMimeTypes)[number] }
  | { ok: false; reason: IngestionSkipReason };

const visionMimeTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

function isAllowedMimeType(value: string): value is AllowedResourceMimeType {
  return (allowedResourceMimeTypes as readonly string[]).includes(value);
}

export function decideIngestion(
  manifest: ResourceManifest,
  file: IncomingFileMeta,
): IngestDecision {
  if (manifest.authorization.status !== "granted") {
    return { ok: false, reason: "authorization_not_granted" };
  }

  if (!manifest.sourceAttribution.trim()) {
    return { ok: false, reason: "missing_source_attribution" };
  }

  if (manifest.storage.relativePath) {
    try {
      assertSafeRelativePath(manifest.storage.relativePath);
    } catch {
      return { ok: false, reason: "unsafe_storage_path" };
    }
  }

  if (!file.exists) {
    return { ok: false, reason: "missing_incoming_file" };
  }

  if (
    manifest.storage.checksumSha256 &&
    file.checksumSha256 &&
    manifest.storage.checksumSha256.toLowerCase() !==
      file.checksumSha256.toLowerCase()
  ) {
    return { ok: false, reason: "checksum_mismatch" };
  }

  const mimeType = file.mimeType ?? manifest.storage.mimeType;

  if (!mimeType || !isAllowedMimeType(mimeType)) {
    return { ok: false, reason: "unsupported_mime" };
  }

  if (visionMimeTypes.has(mimeType)) {
    return { ok: false, reason: "mime_deferred_to_vision" };
  }

  if (mimeType === "application/pdf") {
    return { ok: false, reason: "pdf_extractor_not_wired" };
  }

  return { ok: true, mimeType };
}
