import "server-only";

import { cookies } from "next/headers";

import { welcomeCookieName, welcomeCookieValue } from "@/config/welcome";

export async function hasSeenWelcome(): Promise<boolean> {
  const store = await cookies();
  return store.get(welcomeCookieName)?.value === welcomeCookieValue;
}
