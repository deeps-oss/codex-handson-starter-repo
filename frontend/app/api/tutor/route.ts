import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getEvent, getUnit } from '@/lib/content';
import { guardrails } from '@/lib/safety';
import { TutorRequest, TutorResponse } from '@/lib/types';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildFallback(eventTitle: string, knownFacts: string[]): TutorResponse {
  return {
    summary: `${eventTitle} shaped history. Key points: ${knownFacts.slice(0, 2).join(' ')}`,
    vocabulary: knownFacts.slice(0, 2).map((fact, index) => ({
      term: `Term ${index + 1}`,
      definition: fact
    })),
    quiz: [
      {
        question: `What is one detail about ${eventTitle}?`,
        answerGuide: knownFacts[0] ?? 'Refer to the lesson summary.'
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<TutorRequest>;
  const unit = body.unitId ? getUnit(body.unitId) : undefined;
  const event = body.unitId && body.eventId ? getEvent(body.unitId, body.eventId) : undefined;
  const focusTitle = event?.title ?? 'Historical event';
  const facts = event?.knownFacts ?? [];
  const safety = guardrails(body.studentPrompt ?? '');

  if (!safety.allowed) {
    return NextResponse.json<TutorResponse>(buildFallback(focusTitle, facts));
  }

  if (!openai) {
    return NextResponse.json<TutorResponse>(
      buildFallback(
        focusTitle,
        facts.length
          ? facts
          : ['Use primary sources where possible.', 'Look for causes and consequences.']
      )
    );
  }

  const systemPrompt = `You are HistoryLens, a calm, age-appropriate tutor for secondary students. Keep responses concise (under 220 words), avoid gore, avoid depicting living individuals, and emphasise historical accuracy. Provide gentle encouragement.`;
  const knownFactsBlock = facts.map((f) => `- ${f}`).join('\n');
  const mode = body.mode ?? 'explanation';

  const userPrompt = mode === 'accuracy-check'
    ? `Compare the student's scene idea with known facts. Known facts:\n${knownFactsBlock}\nStudent idea: ${body.studentPrompt || 'N/A'}. Point out inaccuracies and suggest safer, respectful adjustments.`
    : `Explain ${focusTitle} for a student. Known facts:\n${knownFactsBlock}\nProvide: a 4-5 sentence summary; three vocabulary terms with simple definitions; and five quick-check questions (mix multiple-choice and short answer) with brief answer guides.`;

  try {
    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const text = completion.output_text ?? JSON.stringify(completion.output[0]);
    const quiz: TutorResponse['quiz'] = [];
    const vocabulary: TutorResponse['vocabulary'] = [];
    const lines = text.split(/\n|;/).map((l) => l.trim()).filter(Boolean);

    lines.forEach((line) => {
      if (/vocab|term|definition/i.test(line) || line.includes(':')) {
        const [term, definition] = line.split(':');
        if (term && definition) vocabulary.push({ term: term.trim(), definition: definition.trim() });
      }
      if (/\?/g.test(line)) {
        quiz.push({ question: line, answerGuide: 'Reflect on the summary above.' });
      }
    });

    const summary = text.slice(0, 800);

    return NextResponse.json<TutorResponse>({
      summary,
      vocabulary: vocabulary.slice(0, 3),
      quiz: quiz.slice(0, 5),
      accuracyFeedback: mode === 'accuracy-check' ? summary : undefined
    });
  } catch (error) {
    return NextResponse.json<TutorResponse>(buildFallback(focusTitle, facts));
  }
}
