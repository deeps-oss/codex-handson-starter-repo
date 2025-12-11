export type ImageReport = {
  id: string;
  reason: string;
  createdAt: string;
  eventId?: string;
};

const reports: ImageReport[] = [];

export function addReport(report: Omit<ImageReport, 'id' | 'createdAt'>) {
  const entry: ImageReport = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...report
  };
  reports.push(entry);
  return entry;
}

export function listReports() {
  return reports;
}
