import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";
import { getAuthSession, safeNextPath } from "@/lib/auth";
import { hasPublicSupabaseConfig } from "@/lib/env/public";

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const session = await getAuthSession();

  if (session.email) {
    redirect(nextPath);
  }

  return (
    <PageShell
      title="Create account"
      description="New accounts start as students. Staff assign a programme later. LAMLA does not invent a KNUST identity."
    >
      <AuthForm
        mode="signup"
        nextPath={nextPath}
        configured={hasPublicSupabaseConfig()}
      />
    </PageShell>
  );
}
