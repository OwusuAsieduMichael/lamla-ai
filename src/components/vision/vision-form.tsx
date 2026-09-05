"use client";

import { useState, useTransition } from "react";

import { inspectImageAction } from "@/app/actions/vision";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VisionForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Read an academic image</CardTitle>
        <CardDescription>
          The file stays on this device until authorized academic images exist.
          LAMLA will not invent a lecture from an empty corpus.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">Image</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-secondary-foreground"
            onChange={(event) => {
              setFileName(event.target.files?.[0]?.name ?? null);
              setResult(null);
            }}
          />
        </label>
        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const response = await inspectImageAction();
              setResult("error" in response ? response.error : response.text);
            });
          }}
        >
          {isPending ? "Checking authorization…" : "Inspect image"}
        </Button>
        {fileName ? (
          <p className="text-xs text-muted-foreground">Selected: {fileName}</p>
        ) : null}
        {result ? (
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm leading-6">
            {result}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
