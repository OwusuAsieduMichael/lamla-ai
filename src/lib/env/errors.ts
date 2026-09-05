export class EnvConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvConfigError";
  }
}

export function formatMissingEnvMessage(fields: readonly string[]): string {
  return [
    `Missing or invalid environment variable(s): ${fields.join(", ")}.`,
    "Copy .env.example to .env.local and provide development values.",
    "This error never includes secret values.",
  ].join(" ");
}
