import { createContext, Dispatch, SetStateAction } from 'react';

export type Strictness = 'conservative' | 'creative';

export type TeacherSettings = {
  enabled: boolean;
  strictness: Strictness;
  classroomSafe: boolean;
};

export const TeacherSettingsContext = createContext<{
  teacherSettings: TeacherSettings;
  setTeacherSettings: Dispatch<SetStateAction<TeacherSettings>>;
}>({
  teacherSettings: { enabled: false, strictness: 'conservative', classroomSafe: true },
  setTeacherSettings: () => {}
});
