import { NextRequest, NextResponse } from 'next/server';
import { addReport, listReports } from '@/lib/report-store';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { reason, eventId } = body;
  if (!reason) return NextResponse.json({ error: 'Reason required' }, { status: 400 });
  const entry = addReport({ reason: String(reason).slice(0, 280), eventId });
  return NextResponse.json({ report: entry });
}

export async function GET() {
  return NextResponse.json({ reports: listReports() });
}
