"use server";

import { redirect } from "next/navigation";

import { safeNextPath, signInSchema, signUpSchema, updateDisplayNameSchema } from "@/lib/auth";
import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { allowRequest } from "@/lib/security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseInput } from "@/lib/validation/parse";

export type AuthActionState = {
  error?: string;
  message?: string;
};

function authUnavailable(): AuthActionState {
  return {
    error:
      "Auth is not connected. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY first.",
  };
}

export async function signInAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasPublicSupabaseConfig()) {
    return authUnavailable();
  }

  const parsed = parseInput(signInSchema, {
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and a password of at least 8 characters." };
  }

  if (!allowRequest(`auth:signin:${parsed.data.email}`, 8, 60_000)) {
    return { error: "Too many sign-in attempts. Wait a moment and try again." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { error: "Could not sign in with those details." };
    }
  } catch {
    return authUnavailable();
  }

  redirect(safeNextPath(parsed.data.next));
}

export async function signUpAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasPublicSupabaseConfig()) {
    return authUnavailable();
  }

  const parsed = parseInput(signUpSchema, {
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: String(formData.get("displayName") ?? ""),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and a password of at least 8 characters." };
  }

  if (!allowRequest(`auth:signup:${parsed.data.email}`, 5, 60_000)) {
    return { error: "Too many sign-up attempts. Wait a moment and try again." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: parsed.data.displayName
          ? { display_name: parsed.data.displayName }
          : undefined,
      },
    });

    if (error) {
      return { error: "Could not create that account." };
    }

    if (!data.session) {
      return {
        message:
          "Account created. Confirm the email if your Supabase project requires it, then sign in.",
      };
    }
  } catch {
    return authUnavailable();
  }

  redirect(safeNextPath(parsed.data.next));
}

export async function signOutAction() {
  if (!hasPublicSupabaseConfig()) {
    redirect("/");
  }

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    redirect("/");
  }

  redirect("/");
}

export async function updateDisplayNameAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasPublicSupabaseConfig()) {
    return authUnavailable();
  }

  const parsed = parseInput(updateDisplayNameSchema, {
    displayName: String(formData.get("displayName") ?? ""),
  });

  if (!parsed.success) {
    return { error: "Enter a display name of at most 80 characters." };
  }

  if (!allowRequest("auth:profile", 20, 60_000)) {
    return { error: "Too many profile updates. Wait a moment and try again." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Sign in to update your display name." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: parsed.data.displayName })
      .eq("id", user.id);

    if (error) {
      return { error: "Could not update the display name." };
    }
  } catch {
    return authUnavailable();
  }

  return { message: "Display name saved." };
}
