"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavigation } from "@/config/navigation";

export function WorkspaceNav() {
  const pathname = usePathname();

  if (pathname === "/welcome") {
    return null;
  }

  return (
    <>
      {appNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
