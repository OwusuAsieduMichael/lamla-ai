export const appNavigation = [
  { href: "/", label: "Home" },
  { href: "/ask", label: "Ask" },
  { href: "/sources", label: "Sources" },
  { href: "/vision", label: "Vision" },
  { href: "/voice", label: "Voice" },
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Questions" },
] as const;

export type AppNavigationItem = (typeof appNavigation)[number];
