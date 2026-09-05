import Link from "next/link";

import { AuthNav } from "./auth-nav";
import { HideOnWelcome } from "./hide-on-welcome";
import { ThemeToggle } from "./theme-toggle";
import { WorkspaceNav } from "./workspace-nav";
import { appConfig } from "@/config/app";
import { getAuthSession } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getAuthSession();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-brand-green text-xs font-semibold text-brand-gold"
          >
            L
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">
              {appConfig.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Phase {appConfig.phase} · {appConfig.phaseName}
            </p>
          </div>
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        >
          <WorkspaceNav />
          <HideOnWelcome>
            <AuthNav session={session} />
          </HideOnWelcome>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
