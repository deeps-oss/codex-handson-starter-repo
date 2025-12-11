import { SceneDefaults } from './content';

export type ImageRequest = SceneDefaults & {
  eventTitle: string;
  studentNote?: string;
};

export type ImageResponse = {
  imageUrl: string;
  revisedPrompt: string;
  safetyNotes: string;
  error?: string;
};

export type TutorRequest = {
  eventId: string;
  unitId: string;
  studentPrompt?: string;
  mode: 'explanation' | 'accuracy-check';
};

export type TutorResponse = {
  summary: string;
  vocabulary: { term: string; definition: string }[];
  quiz: { question: string; options?: string[]; answerGuide: string }[];
  accuracyFeedback?: string;
};
