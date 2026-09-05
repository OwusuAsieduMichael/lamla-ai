"use client";

import { ErrorState } from "@/components/states/error-state";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main id="main-content" className="flex flex-1 items-center justify-center">
      <ErrorState
        description="This view could not be rendered. Retry the page. Internal details are not shown here."
        action={
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        }
      />
    </main>
  );
}
