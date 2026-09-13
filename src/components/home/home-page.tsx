import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config/app";
import { appNavigation } from "@/config/navigation";
import { pilotScope } from "@/config/pilot";
import type { CapabilityStatus } from "@/lib/capabilities";

type HomePageProps = {
  capabilities: CapabilityStatus;
};

const pilotLabels = [
  pilotScope.institution,
  pilotScope.college,
  pilotScope.faculty,
  pilotScope.department,
  pilotScope.programme,
];

export function HomePage({ capabilities }: HomePageProps) {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12 sm:py-16">
        <section className="max-w-2xl space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Academic intelligence · KNUST web pilot
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Grounded assistance for a defined academic context.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {appConfig.name} understands a question through course, topic,
            concept, and authorized sources. The workspace is available. The
            academic corpus is not loaded yet, so answers refuse instead of
            inventing KNUST material.
          </p>
          <div className="flex flex-wrap gap-2">
            {pilotLabels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-brand-green/20 bg-secondary px-3 py-1 text-xs text-secondary-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/workspace">Open workspace</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Corpus</CardTitle>
              <CardDescription>
                Authorized sources:{" "}
                {capabilities.corpusReady ? "present" : "none yet"}. Retrieval
                and RAG stay empty until granted materials are ingested.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Grounded AI</CardTitle>
              <CardDescription>
                {capabilities.groundedAiReady
                  ? "Provider and corpus are ready."
                  : "Provider keys or authorized sources are still missing. LAMLA will not fabricate an answer."}
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appNavigation.map((item) => (
              <Card key={item.href}>
                <CardHeader>
                  <CardTitle>
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Open {item.label.toLowerCase()}. Empty authorized data
                    stays empty.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        </section>
      </div>
    </main>
  );
}
