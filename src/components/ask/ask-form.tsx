"use client";

import { useState, useTransition } from "react";

import { askQuestionAction } from "@/app/actions/ask";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AskForm() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask in academic context</CardTitle>
        <CardDescription>
          Answers are generated only from authorized retrieved sources. With no
          corpus yet, LAMLA will refuse rather than invent one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">Question</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Ask about a course topic after authorized sources exist."
          />
        </label>
        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const response = await askQuestionAction(question);
              setResult(
                "error" in response ? response.error : response.text,
              );
            });
          }}
        >
          {isPending ? "Checking sources…" : "Ask LAMLA"}
        </Button>
        {result ? (
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm leading-6">
            {result}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
