import units from '@/content/units.json';

export type SceneDefaults = {
  location: string;
  year: string;
  people: string;
  objects: string;
  mood: string;
  style: string;
};

export type Event = {
  id: string;
  title: string;
  years: string;
  region: string;
  summary: string;
  keyTerms: string[];
  knownFacts: string[];
  sceneDefaults: SceneDefaults;
};

export type Unit = {
  id: string;
  title: string;
  summary: string;
  enabled: boolean;
  events: Event[];
};

export const unitList = units as Unit[];

export const getUnit = (id: string) => unitList.find((u) => u.id === id);

export const getEvent = (unitId: string, eventId: string) =>
  getUnit(unitId)?.events.find((e) => e.id === eventId);
