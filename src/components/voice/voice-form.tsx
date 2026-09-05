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

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getBrowserSpeech(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Recognition =
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

  return Recognition ? new Recognition() : null;
}

export function VoiceForm() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speak a question</CardTitle>
        <CardDescription>
          Browser speech can draft the question locally. The answer still comes
          from the same grounded engine and refuses without authorized sources.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Server transcription stays off until a provider key exists. Use the
          speech button only if this browser exposes recognition.
        </p>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">Question</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Speak or type a question after authorized sources exist."
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={listening}
            onClick={() => {
              const recognition = getBrowserSpeech();

              if (!recognition) {
                setResult("This browser does not expose speech recognition.");
                return;
              }

              recognition.lang = "en-GB";
              recognition.interimResults = false;
              recognition.onresult = (event) => {
                const transcript = event.results[0]?.[0]?.transcript ?? "";
                setQuestion(transcript);
                setListening(false);
              };
              recognition.onerror = () => {
                setListening(false);
                setResult("Speech recognition stopped without a transcript.");
              };
              setListening(true);
              recognition.start();
            }}
          >
            {listening ? "Listening…" : "Use browser speech"}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const response = await askQuestionAction(question);
                setResult("error" in response ? response.error : response.text);
              });
            }}
          >
            {isPending ? "Checking sources…" : "Ask LAMLA"}
          </Button>
        </div>
        {result ? (
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm leading-6">
            {result}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
