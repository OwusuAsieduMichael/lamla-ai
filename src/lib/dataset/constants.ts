import { academicStorageBucket } from "@/lib/academic/tables";

export const datasetManifestSchemaVersion = 1;

export const datasetManifestDirectory = "datasets/manifests";
export const datasetIncomingDirectory = "datasets/incoming";

export const allowedResourceMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
] as const;

export type AllowedResourceMimeType = (typeof allowedResourceMimeTypes)[number];

export const datasetStorageBucket = academicStorageBucket;

export const unassignedCourseSegment = "_unassigned";
