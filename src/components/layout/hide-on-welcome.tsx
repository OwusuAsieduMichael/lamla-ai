"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type HideOnWelcomeProps = {
  children: ReactNode;
};

export function HideOnWelcome({ children }: HideOnWelcomeProps) {
  const pathname = usePathname();

  if (pathname === "/welcome") {
    return null;
  }

  return children;
}
