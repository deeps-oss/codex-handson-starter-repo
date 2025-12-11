const bannedPatterns = [
  /blood|gore|violence/i,
  /weapon|gun|knife|explosion/i,
  /hate|racist|extremist/i,
  /celebrity|politician|president|prime minister/i
];

export function sanitizeText(input: string) {
  const trimmed = input.replace(/[^\w\s,.'-]/g, ' ').replace(/\s+/g, ' ').trim();
  const flagged = bannedPatterns.some((pattern) => pattern.test(trimmed));
  return { safeText: trimmed, flagged };
}

export function buildPrompt({
  scene,
  eventTitle,
  strictness
}: {
  scene: Record<string, string>;
  eventTitle: string;
  strictness: 'conservative' | 'creative';
}) {
  const pieces = Object.entries(scene)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const prefix = `System: Generate a classroom-safe, respectful, non-violent historical illustration. Avoid graphic scenes, modern politics, or real contemporary faces. If request seems unsafe, replace with a neutral symbolic scene.`;
  const strictnessLine = strictness === 'conservative'
    ? 'Stay close to known historical details and avoid speculative visuals.'
    : 'You may use gentle, imaginative visuals while staying respectful and age-appropriate.';

  return `${prefix}\nFocus: ${eventTitle}. Scene details: ${pieces}. ${strictnessLine}`;
}

export function guardrails(sceneDescription: string) {
  const { safeText, flagged } = sanitizeText(sceneDescription);
  if (flagged) {
    return {
      allowed: false,
      message:
        'This request might include unsafe or sensitive details. Try describing the setting, tools, and everyday actions instead of violence or real contemporary individuals.'
    };
  }
  return { allowed: true, safeText };
}
