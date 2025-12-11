import { createContext, Dispatch, SetStateAction } from 'react';
import { Unit } from './content';

export type ContentSettings = {
  disabledUnits: Record<string, boolean>;
  disabledEvents: Record<string, boolean>;
};

export const ContentSettingsContext = createContext<{
  contentSettings: ContentSettings;
  setContentSettings: Dispatch<SetStateAction<ContentSettings>>;
  refreshUnits?: Unit[];
}>({
  contentSettings: { disabledUnits: {}, disabledEvents: {} },
  setContentSettings: () => {}
});
