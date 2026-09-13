"use client";

import { useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { saveResponseAction } from "@/app/actions/saved";
import { submitWorkspaceTurn } from "@/app/actions/workspace";
import type { WorkspaceActionResult } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  isWorkspaceChannel,
  learningModeCopy,
  learningModes,
  workspaceChannels,
  type LearningMode,
  type WorkspaceChannel,
} from "@/config/workspace";
import { cn } from "@/lib/utils";

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

type ThreadItem = Extract<WorkspaceActionResult, { text: string }> & {
  question: string;
};

const channelCopy: Record<WorkspaceChannel, string> = {
  text: "Type a question. Retrieval runs before any model call.",
  voice: "Browser speech can draft the question. The same grounded engine answers.",
  image:
    "Image inspection refuses unless authorized academic images and a vision reader exist.",
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

export function WorkspacePanel({ signedIn }: { signedIn: boolean }) {
  const searchParams = useSearchParams();
  const requestedChannel = searchParams.get("channel") ?? "text";
  const initialChannel = isWorkspaceChannel(requestedChannel)
    ? requestedChannel
    : "text";

  const [channel, setChannel] = useState<WorkspaceChannel>(initialChannel);
  const [mode, setMode] = useState<LearningMode>("ask");
  const [question, setQuestion] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const placeholder = useMemo(() => {
    if (channel === "image") {
      return "Describe what you want checked after authorized images exist.";
    }

    return "Ask about a course topic after authorized sources exist.";
  }, [channel]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI workspace</CardTitle>
          <CardDescription>
            Text, voice, and image share one retrieval engine. Empty corpus
            means a refusal, not an invented KNUST answer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Input">
            {workspaceChannels.map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={channel === item ? "default" : "outline"}
                onClick={() => setChannel(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{channelCopy[channel]}</p>

          <div className="flex flex-wrap gap-2" aria-label="Learning mode">
            {learningModes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  mode === item
                    ? "border-brand-green/30 bg-secondary text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {learningModeCopy[item].label}
              </button>
            ))}
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Question</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={placeholder}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            {channel === "voice" ? (
              <Button
                type="button"
                variant="outline"
                disabled={listening}
                onClick={() => {
                  const recognition = getBrowserSpeech();

                  if (!recognition) {
                    setNotice("This browser does not expose speech recognition.");
                    return;
                  }

                  recognition.lang = "en-GB";
                  recognition.interimResults = false;
                  recognition.onresult = (event) => {
                    setQuestion(event.results[0]?.[0]?.transcript ?? "");
                    setListening(false);
                  };
                  recognition.onerror = () => {
                    setListening(false);
                    setNotice("Speech recognition stopped without a transcript.");
                  };
                  setListening(true);
                  recognition.start();
                }}
              >
                {listening ? "Listening…" : "Use browser speech"}
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const response = await submitWorkspaceTurn({
                    question,
                    conversationId,
                    channel,
                    mode,
                  });

                  if ("error" in response) {
                    setNotice(response.error);
                    return;
                  }

                  setNotice(null);
                  setConversationId(response.conversationId);
                  setThread((current) => [
                    ...current,
                    { ...response, question },
                  ]);
                  setQuestion("");
                });
              }}
            >
              {isPending ? "Checking sources…" : "Ask LAMLA"}
            </Button>
          </div>
          {notice ? (
            <p className="text-sm text-muted-foreground">{notice}</p>
          ) : null}
        </CardContent>
      </Card>

      {thread.map((item, index) => (
        <Card key={`${item.question}-${index}`}>
          <CardHeader>
            <CardTitle className="text-base">{item.question}</CardTitle>
            <CardDescription>
              {item.refused ? "Refused" : "Grounded"} · {item.reason}
              {item.match ? ` · match: ${item.match.tier}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6">{item.text}</p>
            {item.match ? (
              <p className="text-sm text-muted-foreground">{item.match.note}</p>
            ) : null}
            {item.sources.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Sources
                </p>
                <ul className="space-y-1 text-sm">
                  {item.sources.map((source) => (
                    <li key={source.id}>
                      {source.sourceTitle} — {source.sourceAttribution}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {item.related.resources.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Related authorized resources
                </p>
                <ul className="space-y-1 text-sm">
                  {item.related.resources.map((resource) => (
                    <li key={`${resource.title}-${resource.sourceAttribution}`}>
                      {resource.title} — {resource.sourceAttribution}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {signedIn ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  startTransition(async () => {
                    const saved = await saveResponseAction({
                      title: item.question,
                      body: item.text,
                      messageId: item.messageId,
                    });
                    setNotice(
                      "error" in saved
                        ? saved.error
                        : "Saved to your library.",
                    );
                  });
                }}
              >
                Save response
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sign in to keep this thread or save a response.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
