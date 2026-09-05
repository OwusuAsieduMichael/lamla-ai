import Link from "next/link";

import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { AuthSession } from "@/lib/auth";

type AuthNavProps = {
  session: AuthSession;
};

export function AuthNav({ session }: AuthNavProps) {
  if (session.email) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/account">{session.profile?.displayName ?? "Account"}</Link>
        </Button>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Create account</Link>
      </Button>
    </div>
  );
}
