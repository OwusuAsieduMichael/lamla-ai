export const appNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
  { href: "/courses", label: "Courses" },
  { href: "/resources", label: "Resources" },
  { href: "/questions", label: "Questions" },
  { href: "/learn", label: "Learn" },
  { href: "/saved", label: "Saved" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
] as const;

export type AppNavigationItem = (typeof appNavigation)[number];
