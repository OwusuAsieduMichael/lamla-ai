import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="flex flex-1 items-center justify-center">
      <EmptyState
        title="Page not found"
        description="That route is not part of the LAMLA web pilot."
        action={
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        }
      />
    </main>
  );
}
