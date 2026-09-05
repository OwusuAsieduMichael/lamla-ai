import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";
import { getAuthSession, safeNextPath } from "@/lib/auth";
import { hasPublicSupabaseConfig } from "@/lib/env/public";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const session = await getAuthSession();

  if (session.email) {
    redirect(nextPath);
  }

  return (
    <PageShell
      title="Sign in"
      description="Sign in to a student account. Academic answers still require authorized sources after you are signed in."
    >
      <AuthForm
        mode="signin"
        nextPath={nextPath}
        configured={hasPublicSupabaseConfig()}
      />
    </PageShell>
  );
}
