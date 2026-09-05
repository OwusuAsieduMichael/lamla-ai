import { LoadingState } from "@/components/states/loading-state";

export default function Loading() {
  return (
    <main id="main-content" className="flex flex-1 items-center justify-center">
      <LoadingState description="Preparing this view." />
    </main>
  );
}
