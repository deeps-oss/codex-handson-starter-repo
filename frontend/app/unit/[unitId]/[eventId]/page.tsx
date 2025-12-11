'use client';

import { notFound, useParams } from 'next/navigation';
import { useContext, useMemo } from 'react';
import { getEvent, getUnit } from '@/lib/content';
import { Tabs } from '@/components/tabs';
import { SceneBuilder } from '@/components/explore/scene-builder';
import { EventBrief } from '@/components/explore/event-brief';
import { CheckUnderstanding } from '@/components/explore/check-understanding';
import { TeacherSettingsContext } from '@/lib/teacher-context';
import { ContentSettingsContext } from '@/lib/content-settings';

export default function ExplorePage() {
  const params = useParams<{ unitId: string; eventId: string }>();
  const event = getEvent(params.unitId, params.eventId);
  const unit = getUnit(params.unitId);
  const { teacherSettings } = useContext(TeacherSettingsContext);
  const { contentSettings } = useContext(ContentSettingsContext);

  if (!unit || !event || contentSettings.disabledUnits[unit.id] || contentSettings.disabledEvents[`${unit.id}:${event.id}`]) {
    return notFound();
  }

  const tabs = useMemo(
    () => [
      {
        key: 'scene',
        label: 'Scene Builder',
        content: <SceneBuilder event={event} unitId={unit.id} />
      },
      {
        key: 'what',
        label: 'What happened?',
        content: <EventBrief event={event} unitId={unit.id} mode="summary" />
      },
      {
        key: 'why',
        label: 'Why it matters',
        content: <EventBrief event={event} unitId={unit.id} mode="impact" />
      },
      {
        key: 'check',
        label: 'Check understanding',
        content: <CheckUnderstanding event={event} unitId={unit.id} />
      }
    ],
    [event, unit.id]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{unit.title}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-stone">{event.title}</h1>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-stone">{event.years}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{event.region}</span>
          {teacherSettings.enabled && (
            <span className="rounded-full bg-ocean/10 px-3 py-1 text-xs text-ocean">Teacher mode: {teacherSettings.strictness}</span>
          )}
        </div>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">{event.summary}</p>
      </div>

      <Tabs tabs={tabs} defaultKey="scene" />
    </div>
  );
}
