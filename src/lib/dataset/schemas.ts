import { z } from "zod";

import {
  authorizationStatuses,
  resourceKinds,
  semesters,
} from "@/lib/academic/enums";

import {
  allowedResourceMimeTypes,
  datasetManifestSchemaVersion,
  datasetStorageBucket,
} from "./constants";
import { assertSafeRelativePath } from "./paths";

const nonEmptyTextSchema = z.string().trim().min(1);
const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens.");

export const authorizationStatusSchema = z.enum(authorizationStatuses);

export const resourceAuthorizationSchema = z
  .object({
    status: authorizationStatusSchema,
    authorizedBy: z.string().trim().min(1).nullable(),
    authorizedAt: z.string().trim().min(1).nullable(),
    note: z.string().trim().min(1).nullable(),
  })
  .superRefine((value, context) => {
    if (value.status !== "granted") {
      return;
    }

    if (!value.authorizedBy) {
      context.addIssue({
        code: "custom",
        path: ["authorizedBy"],
        message: "Granted authorization requires the authorizing party.",
      });
    }

    if (!value.authorizedAt) {
      context.addIssue({
        code: "custom",
        path: ["authorizedAt"],
        message: "Granted authorization requires an authorization date.",
      });
    }
  });

export const resourceManifestSchema = z
  .object({
    schemaVersion: z.literal(datasetManifestSchemaVersion),
    id: slugSchema,
    title: nonEmptyTextSchema,
    kind: z.enum(resourceKinds),
    sourceAttribution: nonEmptyTextSchema,
    authorization: resourceAuthorizationSchema,
    license: z.string().trim().min(1).nullable(),
    programmeId: z.uuid(),
    courseCode: z.string().trim().min(1).nullable(),
    courseTitle: z.string().trim().min(1).nullable(),
    academicYear: z.string().trim().min(1).nullable(),
    semester: z.enum(semesters).nullable(),
    storage: z.object({
      bucket: z.literal(datasetStorageBucket),
      relativePath: z.string().trim().min(1).nullable(),
      mimeType: z.enum(allowedResourceMimeTypes).nullable(),
      checksumSha256: z
        .string()
        .regex(/^[a-f0-9]{64}$/i, "Checksum must be a SHA-256 hex digest.")
        .nullable(),
    }),
  })
  .superRefine((value, context) => {
    if (!value.storage.relativePath) {
      return;
    }

    try {
      assertSafeRelativePath(value.storage.relativePath);
    } catch (error) {
      context.addIssue({
        code: "custom",
        path: ["storage", "relativePath"],
        message:
          error instanceof Error ? error.message : "Storage path is invalid.",
      });
    }
  });

export type ResourceAuthorization = z.infer<typeof resourceAuthorizationSchema>;
export type ResourceManifest = z.infer<typeof resourceManifestSchema>;
