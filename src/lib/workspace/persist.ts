import "server-only";

import { getAuthSession } from "@/lib/auth";
import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LearningMode, WorkspaceChannel } from "@/config/workspace";
import type { RankedChunk } from "@/lib/retrieval";

export type PersistTurnInput = {
  conversationId?: string | null;
  question: string;
  answer: string;
  refused: boolean;
  reason?: string | null;
  channel: WorkspaceChannel;
  mode: LearningMode;
  sources: RankedChunk[];
};

export type PersistTurnResult = {
  conversationId: string;
  assistantMessageId: string;
};

function titleFromQuestion(question: string): string {
  const compact = question.replace(/\s+/g, " ").trim();
  return compact.length > 80 ? `${compact.slice(0, 77)}…` : compact;
}

export async function persistWorkspaceTurn(
  input: PersistTurnInput,
): Promise<PersistTurnResult | null> {
  if (!hasPublicSupabaseConfig()) {
    return null;
  }

  const session = await getAuthSession();

  if (!session.profile) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    let conversationId = input.conversationId ?? null;

    if (conversationId) {
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("profile_id", session.profile.id)
        .maybeSingle();

      if (!existing) {
        conversationId = null;
      }
    }

    if (!conversationId) {
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
          profile_id: session.profile.id,
          title: titleFromQuestion(input.question),
        })
        .select("id")
        .single();

      if (conversationError || !conversation) {
        return null;
      }

      conversationId = conversation.id;
    }

    const { error: userMessageError } = await supabase
      .from("conversation_messages")
      .insert({
        conversation_id: conversationId,
        profile_id: session.profile.id,
        role: "user",
        content: input.question,
        channel: input.channel,
        mode: input.mode,
        refused: false,
      });

    if (userMessageError) {
      return null;
    }

    const { data: assistantMessage, error: assistantError } = await supabase
      .from("conversation_messages")
      .insert({
        conversation_id: conversationId,
        profile_id: session.profile.id,
        role: "assistant",
        content: input.answer,
        channel: input.channel,
        mode: input.mode,
        refused: input.refused,
        reason: input.reason ?? null,
      })
      .select("id")
      .single();

    if (assistantError || !assistantMessage) {
      return null;
    }

    if (input.sources.length > 0) {
      await supabase.from("conversation_sources").insert(
        input.sources.map((source) => ({
          message_id: assistantMessage.id,
          chunk_id: source.id,
          source_title: source.sourceTitle,
          source_attribution: source.sourceAttribution,
          excerpt: source.content.slice(0, 400),
        })),
      );
    }

    await supabase.from("query_history").insert({
      profile_id: session.profile.id,
      query: input.question,
      channel: input.channel,
      mode: input.mode,
      refused: input.refused,
    });

    return {
      conversationId,
      assistantMessageId: assistantMessage.id,
    };
  } catch {
    return null;
  }
}

export async function loadOwnHistory(limit = 30) {
  if (!hasPublicSupabaseConfig()) {
    return [];
  }

  const session = await getAuthSession();

  if (!session.profile) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("query_history")
      .select("id, query, channel, mode, refused, created_at")
      .eq("profile_id", session.profile.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export async function loadOwnSavedItems(limit = 30) {
  if (!hasPublicSupabaseConfig()) {
    return [];
  }

  const session = await getAuthSession();

  if (!session.profile) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("saved_items")
      .select("id, kind, title, body, created_at")
      .eq("profile_id", session.profile.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export async function saveOwnedItem(input: {
  title: string;
  body: string;
  kind?: "response" | "resource";
  messageId?: string | null;
}): Promise<{ id: string } | { error: string }> {
  if (!hasPublicSupabaseConfig()) {
    return { error: "Auth is not connected." };
  }

  const session = await getAuthSession();

  if (!session.profile) {
    return { error: "Sign in to save a response." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("saved_items")
      .insert({
        profile_id: session.profile.id,
        kind: input.kind ?? "response",
        title: input.title,
        body: input.body,
        conversation_message_id: input.messageId ?? null,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { error: "Could not save that item." };
    }

    return { id: data.id };
  } catch {
    return { error: "Could not save that item." };
  }
}
