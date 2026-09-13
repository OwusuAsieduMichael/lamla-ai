import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { appNavigation } from "@/config/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCapabilityStatus } from "@/lib/capabilities";
import { loadAuthorizedCourses } from "@/lib/courses";
import { loadAuthorizedPastQuestions } from "@/lib/questions";
import { loadAuthorizedResources } from "@/lib/retrieval/load";

export default async function DashboardPage() {
  const [session, capabilities, courses, resources, papers] = await Promise.all([
    getAuthSession(),
    Promise.resolve(getCapabilityStatus()),
    loadAuthorizedCourses(),
    loadAuthorizedResources(),
    loadAuthorizedPastQuestions(),
  ]);

  return (
    <PageShell
      title="Dashboard"
      description="A student hub for the KNUST Computer Science pilot. Counts stay at zero until authorized records exist."
    >
      {!session.configured ? (
        <CapabilityNote
          title="Supabase is not connected"
          description="You can browse the product shell. Sign-in, saved items, and history wait for public Supabase values."
        />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>
              {courses.length} authorized course
              {courses.length === 1 ? "" : "s"} on file.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              {resources.length} granted source
              {resources.length === 1 ? "" : "s"}.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Past questions</CardTitle>
            <CardDescription>
              {papers.length} attributed paper
              {papers.length === 1 ? "" : "s"}.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Corpus</CardTitle>
            <CardDescription>
              {capabilities.corpusReady
                ? "Authorized manifests are present."
                : "No authorized corpus yet. Retrieval will refuse."}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Grounded AI</CardTitle>
            <CardDescription>
              {capabilities.groundedAiReady
                ? "Provider and corpus are ready."
                : "Provider keys or authorized sources are still missing."}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/workspace">Open workspace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/resources">Browse resources</Link>
        </Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {appNavigation
          .filter((item) => item.href !== "/dashboard")
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-border px-4 py-3 text-sm hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
      </section>
    </PageShell>
  );
}
