export type VoiceSessionStatus = {
  browserSpeechAvailable: boolean;
  serverTranscriptionConfigured: boolean;
};

export function getVoiceSessionStatus(
  hasBrowserSpeech: boolean,
  hasProviderKey: boolean,
): VoiceSessionStatus {
  return {
    browserSpeechAvailable: hasBrowserSpeech,
    serverTranscriptionConfigured: hasProviderKey,
  };
}
