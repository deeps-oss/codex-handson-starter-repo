'use client';

import Image from 'next/image';
import { useContext, useMemo, useState } from 'react';
import { Event } from '@/lib/content';
import { ImageResponse } from '@/lib/types';
import { TeacherSettingsContext } from '@/lib/teacher-context';

export function SceneBuilder({ event, unitId }: { event: Event; unitId: string }) {
  const { teacherSettings } = useContext(TeacherSettingsContext);
  const [form, setForm] = useState({ ...event.sceneDefaults, studentNote: '' });
  const [images, setImages] = useState<ImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageResponse | null>(null);

  const sceneDescription = useMemo(() => Object.values(form).join(' '), [form]);

  const generateImages = async () => {
    setLoading(true);
    setFeedback('');
    try {
      const results: ImageResponse[] = [];
      for (let i = 0; i < 3; i++) {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, eventTitle: event.title, strictness: teacherSettings.strictness })
        });
        results.push(await res.json());
      }
      setImages(results);
    } finally {
      setLoading(false);
    }
  };

  const checkAccuracy = async () => {
    setFeedback('Checking...');
    const res = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitId,
        eventId: event.id,
        studentPrompt: sceneDescription,
        mode: 'accuracy-check'
      })
    });
    const data = await res.json();
    setFeedback(data.accuracyFeedback || 'Review your scene to match key facts.');
  };

  const reportImage = async (image: ImageResponse) => {
    await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reportMessage || 'Not appropriate', eventId: event.id, imageUrl: image.imageUrl })
    });
    setReportMessage('Thank you for reporting.');
    setTimeout(() => setReportMessage(''), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {['location', 'year', 'people', 'objects', 'mood', 'style'].map((key) => (
            <label key={key} className="flex flex-col gap-1 text-sm font-semibold text-stone">
              <span className="text-xs uppercase tracking-wide text-gray-500">{key}</span>
              <input
                value={(form as any)[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean"
              />
            </label>
          ))}
        </div>
        <label className="flex flex-col gap-2 text-sm font-semibold text-stone">
          <span className="text-xs uppercase tracking-wide text-gray-500">Your extra notes</span>
          <textarea
            value={form.studentNote}
            onChange={(e) => setForm((prev) => ({ ...prev, studentNote: e.target.value }))}
            className="min-h-[90px] rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean"
            placeholder="Add mood, time of day, or details to make the scene clearer."
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateImages}
            disabled={loading}
            className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone disabled:opacity-60"
          >
            {loading ? 'Generating...' : 'Generate 3 variations'}
          </button>
          <button
            onClick={checkAccuracy}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-stone transition hover:border-ocean hover:text-ocean"
          >
            Historical accuracy check
          </button>
        </div>
        {feedback && <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-stone ring-1 ring-gray-200">{feedback}</p>}
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">Generated images will appear below. Click to enlarge. Caption reminds students that visuals may not be exact.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className="group flex flex-col gap-2 rounded-xl bg-white p-2 text-left shadow-sm ring-1 ring-gray-100 hover:ring-ocean focus:outline-none focus:ring-2 focus:ring-ocean"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                {img.imageUrl && (
                  <Image
                    src={img.imageUrl}
                    alt={`Variation ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                )}
              </div>
              <p className="text-xs text-gray-600">AI-generated visualisation (may not be historically exact).</p>
              <p className="text-[11px] text-gray-500 line-clamp-3">{img.revisedPrompt}</p>
            </button>
          ))}
        </div>
        {images.length === 0 && <p className="text-sm text-gray-600">Start by generating images with the scene builder.</p>}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4" role="dialog">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={selectedImage.imageUrl}
                alt="Selected visual"
                fill
                sizes="100vw"
                className="object-contain bg-gray-100"
              />
            </div>
            <p className="mt-2 text-xs text-gray-600">AI-generated visualisation (may not be historically exact).</p>
            <p className="mt-1 text-sm text-gray-700">{selectedImage.revisedPrompt}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <input
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
                placeholder="Report image (reason)"
              />
              <button
                onClick={() => reportImage(selectedImage)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Report image
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-stone hover:border-ocean"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
