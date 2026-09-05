"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { welcomeCookieName, welcomeCookieValue } from "@/config/welcome";

export async function completeWelcomeAction(formData: FormData) {
  const destination = formData.get("destination");
  const path = destination === "signup" ? "/signup" : "/login";
  const store = await cookies();

  store.set(welcomeCookieName, welcomeCookieValue, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  redirect(`${path}?next=/`);
}
