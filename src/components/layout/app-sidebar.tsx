"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  GraduationCap,
  History,
  LayoutDashboard,
  Library,
  MessageSquare,
  Sparkles,
  UserRound,
} from "lucide-react";

import { appNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

const icons = {
  "/dashboard": LayoutDashboard,
  "/workspace": MessageSquare,
  "/courses": GraduationCap,
  "/resources": Library,
  "/questions": BookOpen,
  "/learn": Sparkles,
  "/saved": Bookmark,
  "/history": History,
  "/profile": UserRound,
} as const;

const hiddenPrefixes = ["/welcome", "/login", "/signup"];

export function AppSidebar() {
  const pathname = usePathname();

  if (hiddenPrefixes.some((prefix) => pathname === prefix || pathname === "/")) {
    return null;
  }

  return (
    <aside className="border-b border-border bg-background md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <nav
        aria-label="Student"
        className="mx-auto flex w-full max-w-5xl flex-wrap gap-1 px-4 py-3 md:mx-0 md:max-w-none md:flex-col md:px-3 md:py-6"
      >
        {appNavigation.map((item) => {
          const Icon = icons[item.href];
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
