'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { getUnit } from '@/lib/content';
import { TimelineCard } from '@/components/timeline-card';
import { TeacherSettingsContext } from '@/lib/teacher-context';
import { ContentSettingsContext } from '@/lib/content-settings';

export default function UnitPage() {
  const params = useParams<{ unitId: string }>();
  const unit = getUnit(params.unitId);
  const { teacherSettings } = useContext(TeacherSettingsContext);
  const { contentSettings, setContentSettings } = useContext(ContentSettingsContext);

  if (!unit) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Unit</p>
            <h1 className="text-3xl font-bold text-stone">{unit.title}</h1>
            <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">{unit.summary}</p>
          </div>
          {teacherSettings.enabled && (
            <label className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-xs font-semibold text-stone ring-1 ring-gray-200">
              <input
                type="checkbox"
                checked={!contentSettings.disabledUnits[unit.id]}
                onChange={(e) =>
                  setContentSettings((prev) => ({
                    ...prev,
                    disabledUnits: { ...prev.disabledUnits, [unit.id]: !e.target.checked }
                  }))
                }
              />
              <span>{contentSettings.disabledUnits[unit.id] ? 'Disabled' : 'Enabled'}</span>
            </label>
          )}
        </div>
        <div className="flex gap-3 text-sm text-gray-600">
          <Link href="/" className="underline underline-offset-4">Back to units</Link>
          <span>•</span>
          <span>{unit.events.length} events</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {unit.events.map((event) => {
          const disabled = contentSettings.disabledEvents[`${unit.id}:${event.id}`] || contentSettings.disabledUnits[unit.id];
          return (
            <div key={event.id} className="relative">
              {teacherSettings.enabled && (
                <label className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs shadow-sm">
                  <input
                    type="checkbox"
                    checked={!disabled}
                    onChange={(e) =>
                      setContentSettings((prev) => ({
                        ...prev,
                        disabledEvents: {
                          ...prev.disabledEvents,
                          [`${unit.id}:${event.id}`]: !e.target.checked
                        }
                      }))
                    }
                  />
                  <span>{disabled ? 'Disabled' : 'Enabled'}</span>
                </label>
              )}
              {!disabled ? (
                <TimelineCard event={event} href={`/unit/${unit.id}/${event.id}`} />
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                  <p className="font-semibold text-stone">{event.title}</p>
                  <p>Disabled for students.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
