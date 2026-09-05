"use client";

import { useActionState } from "react";

import {
  updateDisplayNameAction,
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

type AccountFormProps = {
  displayName: string | null;
};

export function AccountForm({ displayName }: AccountFormProps) {
  const [state, formAction, isPending] = useActionState<
    AuthActionState,
    FormData
  >(updateDisplayNameAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display name</CardTitle>
        <CardDescription>
          Students can change only this field. Role and programme stay staff-controlled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Name</span>
            <input
              name="displayName"
              type="text"
              maxLength={80}
              defaultValue={displayName ?? ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save display name"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
