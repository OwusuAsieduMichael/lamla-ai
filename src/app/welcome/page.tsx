import { redirect } from "next/navigation";

import { WelcomeCarousel } from "@/components/welcome/welcome-carousel";
import { getAuthSession } from "@/lib/auth";

export default async function WelcomePage() {
  const session = await getAuthSession();

  if (session.email) {
    redirect("/");
  }

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <WelcomeCarousel />
    </main>
  );
}
