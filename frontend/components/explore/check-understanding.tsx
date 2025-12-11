'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/lib/content';
import { TutorResponse } from '@/lib/types';

export function CheckUnderstanding({ event, unitId }: { event: Event; unitId: string }) {
  const [quiz, setQuiz] = useState<TutorResponse['quiz']>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, eventId: event.id, mode: 'explanation' })
      });
      const data: TutorResponse = await res.json();
      if (data.quiz?.length) {
        setQuiz(data.quiz);
      } else {
        setQuiz([
          { question: `When did ${event.title} take place?`, answerGuide: event.years },
          { question: `Name one person or group involved in ${event.title}.`, answerGuide: event.keyTerms[0] },
          { question: 'What was one cause?', answerGuide: event.knownFacts[0] },
          { question: 'What was one effect?', answerGuide: event.knownFacts[1] ?? event.summary },
          { question: 'How might people at the time have felt?', answerGuide: 'Look at mood and impacts.' }
        ]);
      }
    };
    load();
  }, [event]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Answer independently, then check your thinking.</p>
      <ol className="space-y-2">
        {quiz.map((item, idx) => (
          <li key={idx} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-stone">{idx + 1}. {item.question}</p>
              {item.options && (
                <span className="text-[11px] text-gray-500">Multiple choice</span>
              )}
            </div>
            {item.options && (
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {item.options.map((opt) => (
                  <span key={opt} className="rounded-full bg-gray-100 px-3 py-1">{opt}</span>
                ))}
              </div>
            )}
            {showAnswers && (
              <p className="mt-2 text-sm text-gray-700">Answer guide: {item.answerGuide}</p>
            )}
          </li>
        ))}
      </ol>
      <button
        onClick={() => setShowAnswers((s) => !s)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-stone hover:border-ocean"
      >
        {showAnswers ? 'Hide answers' : 'Show answers'}
      </button>
    </div>
  );
}
