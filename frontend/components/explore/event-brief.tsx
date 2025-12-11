'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/lib/content';

export function EventBrief({ event, unitId, mode }: { event: Event; unitId: string; mode: 'summary' | 'impact' }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, eventId: event.id, mode: 'explanation' })
      });
      const data = await res.json();
      if (mode === 'summary') {
        setText(data.summary);
      } else {
        const lines = event.knownFacts.map((fact, idx) => `${idx + 1}. ${fact}`).join('\n');
        setText(`Key impacts and causes:\n${lines}\nThink about: What changed right away? What changed over time?`);
      }
      setLoading(false);
    };
    load();
  }, [event.id, event.knownFacts, mode, unitId]);

  const bullets = mode === 'impact' ? event.knownFacts : [];

  return (
    <div className="space-y-3">
      {loading ? <p className="text-sm text-gray-600">Loading tutor notes...</p> : <p className="whitespace-pre-line text-sm leading-relaxed text-stone">{text}</p>}
      {bullets.length > 0 && (
        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
          <h4 className="text-sm font-semibold text-stone">Cause / effect chain</h4>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-gray-700">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
