import { EmptyState } from "@/components/states/empty-state";

type CapabilityNoteProps = {
  title: string;
  description: string;
};

export function CapabilityNote({ title, description }: CapabilityNoteProps) {
  return <EmptyState title={title} description={description} />;
}
