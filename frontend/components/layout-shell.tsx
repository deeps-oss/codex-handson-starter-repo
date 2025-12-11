'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
import { TeacherSettingsContext } from '@/lib/teacher-context';
import { ContentSettingsContext } from '@/lib/content-settings';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { teacherSettings, setTeacherSettings } = useContext(TeacherSettingsContext);
  const { contentSettings, setContentSettings } = useContext(ContentSettingsContext);
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');

  const handleTeacherToggle = () => {
    if (!teacherSettings.enabled) {
      const passcode = process.env.NEXT_PUBLIC_TEACHER_PASSCODE;
      if (codeInput.trim() === passcode) {
        setTeacherSettings({ ...teacherSettings, enabled: true });
        setError('');
      } else {
        setError('Incorrect passcode.');
      }
    } else {
      setTeacherSettings({ ...teacherSettings, enabled: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="backdrop-blur bg-white/70 border-b border-gray-200 sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ocean text-white">HL</span>
            <div>
              <div>HistoryLens</div>
              <p className="text-xs text-gray-500">AI visuals + guided history</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">Mode:</span>
              <span className="px-2 py-1 rounded-full bg-gray-100">{teacherSettings.enabled ? 'Teacher' : 'Student'}</span>
            </div>
            <input
              aria-label="Teacher passcode"
              className="rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
              placeholder="Passcode"
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <button
              onClick={handleTeacherToggle}
              className="rounded-md bg-ocean px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean"
            >
              {teacherSettings.enabled ? 'Exit Teacher' : 'Enter Teacher'}
            </button>
          </div>
        </div>
        {error && <p className="text-center text-sm text-red-600 pb-2">{error}</p>}
        {pathname !== '/' && (
          <nav className="mx-auto max-w-6xl px-4 pb-3 text-sm text-gray-600 flex gap-3 flex-wrap">
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          </nav>
        )}
      </header>
      {teacherSettings.enabled && (
        <div className="bg-white/80 border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <label className="font-semibold" htmlFor="strictness">Strictness</label>
              <select
                id="strictness"
                value={teacherSettings.strictness}
                onChange={(e) => setTeacherSettings({ ...teacherSettings, strictness: e.target.value as any })}
                className="rounded-md border border-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ocean"
              >
                <option value="conservative">Conservative</option>
                <option value="creative">Creative</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={teacherSettings.classroomSafe}
                onChange={(e) => setTeacherSettings({ ...teacherSettings, classroomSafe: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Classroom-safe mode</span>
            </label>
            <button
              className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-stone hover:bg-gray-50"
              onClick={() => setContentSettings({ disabledUnits: {}, disabledEvents: {} })}
            >
              Reset unit visibility
            </button>
            <div className="text-xs text-gray-600">Use toggles on unit/event cards to enable/disable.</div>
          </div>
        </div>
      )}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
      <footer className="border-t border-gray-200 bg-white/60 py-4 text-center text-sm text-gray-600">
        Designed for safe, engaging history learning. Classroom-safe mode: {teacherSettings.classroomSafe ? 'On' : 'Off'}.
      </footer>
    </div>
  );
}
