export const workspaceChannels = ["text", "voice", "image"] as const;

export type WorkspaceChannel = (typeof workspaceChannels)[number];

export const learningModes = [
  "ask",
  "simplify",
  "detail",
  "example",
  "practice",
  "hint",
  "solution",
  "related",
  "prerequisite",
  "continue",
] as const;

export type LearningMode = (typeof learningModes)[number];

export const learningModeCopy: Record<
  LearningMode,
  { label: string; instruction: string }
> = {
  ask: {
    label: "Ask",
    instruction: "Answer the question using only authorized excerpts.",
  },
  simplify: {
    label: "Explain simply",
    instruction:
      "Explain the question simply, using only authorized excerpts. Do not add outside material.",
  },
  detail: {
    label: "Explain in detail",
    instruction:
      "Explain the question in more detail, using only authorized excerpts.",
  },
  example: {
    label: "Give example",
    instruction:
      "Give an example only if one appears in the authorized excerpts. Otherwise say none is available.",
  },
  practice: {
    label: "Test me",
    instruction:
      "If authorized excerpts contain a practice item, present it. Do not invent a question.",
  },
  hint: {
    label: "Hint",
    instruction:
      "Give a short hint from authorized excerpts only. Do not invent a solution.",
  },
  solution: {
    label: "Show solution",
    instruction:
      "Show a solution only if authorized excerpts contain one. Otherwise say none is available.",
  },
  related: {
    label: "Related concept",
    instruction:
      "Name related concepts only if they appear in the authorized excerpts.",
  },
  prerequisite: {
    label: "Prerequisite",
    instruction:
      "Name prerequisite ideas only if they appear in the authorized excerpts.",
  },
  continue: {
    label: "Continue learning",
    instruction:
      "Recommend the next authorized excerpt to study. Do not invent a syllabus.",
  },
};

export function isLearningMode(value: string): value is LearningMode {
  return (learningModes as readonly string[]).includes(value);
}

export function isWorkspaceChannel(value: string): value is WorkspaceChannel {
  return (workspaceChannels as readonly string[]).includes(value);
}
