import { redirect } from "next/navigation";

import { AccountForm } from "@/components/auth/account-form";
import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session.configured) {
    return (
      <PageShell
        title="Profile"
        description="Your signed-in profile. Role and programme stay staff-controlled."
      >
        <CapabilityNote
          title="Auth is not connected"
          description="Set the public Supabase values before an account can be created or signed in."
        />
      </PageShell>
    );
  }

  if (!session.email) {
    redirect("/login?next=/profile");
  }

  return (
    <PageShell
      title="Profile"
      description="Your signed-in profile. Role and programme stay staff-controlled."
    >
      <Card>
        <CardHeader>
          <CardTitle>{session.email}</CardTitle>
          <CardDescription>
            Role: {session.profile?.role ?? "unknown until a profile row exists"}.
            Programme:{" "}
            {session.profile?.programmeName ??
              "not assigned yet. Staff assign the official KNUST Computer Science programme; students cannot choose one here."}
          </CardDescription>
        </CardHeader>
      </Card>
      {session.profile ? (
        <AccountForm displayName={session.profile.displayName} />
      ) : (
        <CapabilityNote
          title="Profile row missing"
          description="The auth user exists, but no profiles row was found. Apply the academic migrations so new users receive a student profile."
        />
      )}
    </PageShell>
  );
}
