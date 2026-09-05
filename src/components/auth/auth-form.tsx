"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  signInAction,
  signUpAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fieldClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

type AuthFormProps = {
  mode: "signin" | "signup";
  nextPath: string;
  configured: boolean;
};

export function AuthForm({ mode, nextPath, configured }: AuthFormProps) {
  const action = mode === "signin" ? signInAction : signUpAction;
  const [state, formAction, isPending] = useActionState<
    AuthActionState,
    FormData
  >(action, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "signin" ? "Sign in" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Use the email and password for your LAMLA account. New accounts start as students."
            : "New accounts are students. Staff assign a programme later. LAMLA will not invent a KNUST identity."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          {mode === "signup" ? (
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Display name</span>
              <input
                name="displayName"
                type="text"
                maxLength={80}
                autoComplete="name"
                className={fieldClassName}
                placeholder="Optional"
              />
            </label>
          ) : null}
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClassName}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              className={fieldClassName}
            />
          </label>
          {!configured ? (
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm leading-6">
              Auth is not connected yet. Set the public Supabase values in
              `.env.local` before an account can be created or signed in.
            </p>
          ) : null}
          {state.error ? (
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm leading-6">
              {state.error}
            </p>
          ) : null}
          {state.message ? (
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm leading-6">
              {state.message}
            </p>
          ) : null}
          <Button type="submit" disabled={isPending || !configured}>
            {isPending
              ? "Working…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Need an account?{" "}
                <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="underline">
                  Create one
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
