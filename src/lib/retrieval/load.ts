import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { RetrievableChunk } from "./rank";

export type AuthorizedResource = {
  id: string;
  title: string;
  kind: string;
  sourceAttribution: string;
  academicYear: string | null;
};

export async function loadAuthorizedChunks(): Promise<RetrievableChunk[]> {
  return queryWhenConfigured(async (supabase) => {
    const { data: resources, error: resourceError } = await supabase
      .from("academic_resources")
      .select("id, title, source_attribution")
      .eq("status", "approved")
      .eq("authorization_status", "granted");

    if (resourceError || !resources?.length) {
      return [];
    }

    const { data: chunks, error: chunkError } = await supabase
      .from("resource_chunks")
      .select("id, content, resource_id, importance_score")
      .in(
        "resource_id",
        resources.map((resource) => resource.id),
      );

    if (chunkError || !chunks) {
      return [];
    }

    const byId = new Map(resources.map((resource) => [resource.id, resource]));

    return chunks.flatMap((chunk) => {
      const resource = chunk.resource_id
        ? byId.get(chunk.resource_id)
        : undefined;

      if (!resource) {
        return [];
      }

      return [
        {
          id: chunk.id,
          content: chunk.content,
          sourceTitle: resource.title,
          sourceAttribution: resource.source_attribution,
          importanceScore: chunk.importance_score ?? 0,
        },
      ];
    });
  });
}

export async function loadAuthorizedResources(): Promise<AuthorizedResource[]> {
  return queryWhenConfigured(async (supabase) => {
    const { data, error } = await supabase
      .from("academic_resources")
      .select("id, title, kind, source_attribution, academic_year")
      .eq("status", "approved")
      .eq("authorization_status", "granted");

    if (error || !data) {
      return [];
    }

    return data.map((resource) => ({
      id: resource.id,
      title: resource.title,
      kind: resource.kind,
      sourceAttribution: resource.source_attribution,
      academicYear: resource.academic_year,
    }));
  });
}

async function queryWhenConfigured<T>(
  query: (
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ) => Promise<T[]>,
): Promise<T[]> {
  if (!hasPublicSupabaseConfig()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    return await query(supabase);
  } catch {
    return [];
  }
}
