import { PageShell } from "@/components/layout/page-shell";
import { VoiceForm } from "@/components/voice/voice-form";

export default function VoicePage() {
  return (
    <PageShell
      title="Voice interaction"
      description="Voice turns into a question for the same grounded engine. Server transcription stays off until a provider key exists."
    >
      <VoiceForm />
    </PageShell>
  );
}
