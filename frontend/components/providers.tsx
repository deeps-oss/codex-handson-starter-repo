'use client';

import { ReactNode, useMemo, useState } from 'react';
import { TeacherSettingsContext, TeacherSettings } from '@/lib/teacher-context';
import { ContentSettings, ContentSettingsContext } from '@/lib/content-settings';

export function AppProviders({ children }: { children: ReactNode }) {
  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>({
    enabled: false,
    strictness: 'conservative',
    classroomSafe: true
  });

  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    disabledUnits: {},
    disabledEvents: {}
  });

  const value = useMemo(
    () => ({ teacherSettings, setTeacherSettings }),
    [teacherSettings]
  );

  return (
    <TeacherSettingsContext.Provider value={value}>
      <ContentSettingsContext.Provider value={{ contentSettings, setContentSettings }}>
        {children}
      </ContentSettingsContext.Provider>
    </TeacherSettingsContext.Provider>
  );
}
