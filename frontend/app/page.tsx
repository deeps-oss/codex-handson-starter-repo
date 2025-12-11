'use client';

import { useContext, useMemo } from 'react';
import { unitList } from '@/lib/content';
import { UnitCard } from '@/components/unit-card';
import { TeacherSettingsContext } from '@/lib/teacher-context';
import { ContentSettingsContext } from '@/lib/content-settings';

export default function HomePage() {
  const { teacherSettings } = useContext(TeacherSettingsContext);
  const { contentSettings, setContentSettings } = useContext(ContentSettingsContext);

  const visibleUnits = useMemo(
    () => unitList.filter((u) => !contentSettings.disabledUnits[u.id]),
    [contentSettings.disabledUnits]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-ocean to-stone px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:w-2/3">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Interactive history lab</p>
          <h1 className="text-4xl font-bold leading-tight">HistoryLens</h1>
          <p className="text-lg text-white/90">
            Build vivid, accurate scenes, check historical reasoning, and get quick feedback — all with classroom-safe AI guidance.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/20 px-3 py-1">Guided image prompts</span>
            <span className="rounded-full bg-white/20 px-3 py-1">200–300 word briefs</span>
            <span className="rounded-full bg-white/20 px-3 py-1">Teacher safety controls</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone">Pick a unit</h2>
            <p className="text-sm text-gray-600">Explore timelines, generate visuals, and answer quick checks.</p>
          </div>
          {teacherSettings.enabled && (
            <p className="text-xs text-gray-600">Toggle visibility directly on each card.</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {unitList.map((unit) => {
            const disabled = contentSettings.disabledUnits[unit.id];
            return (
              <div key={unit.id} className="relative">
                {teacherSettings.enabled && (
                  <label className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs shadow-sm">
                    <input
                      type="checkbox"
                      checked={!disabled}
                      onChange={(e) =>
                        setContentSettings((prev) => ({
                          ...prev,
                          disabledUnits: { ...prev.disabledUnits, [unit.id]: !e.target.checked }
                        }))
                      }
                    />
                    <span>{disabled ? 'Disabled' : 'Enabled'}</span>
                  </label>
                )}
                {!disabled ? <UnitCard unit={unit} /> : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                    <p className="font-semibold text-stone">{unit.title}</p>
                    <p>Disabled in teacher view.</p>
                  </div>
                )}
              </div>
            );
          })}
          {visibleUnits.length === 0 && <p className="text-sm text-gray-600">All units are disabled.</p>}
        </div>
      </section>
    </div>
  );
}
