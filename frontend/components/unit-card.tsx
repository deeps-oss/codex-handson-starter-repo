import Link from 'next/link';
import { Unit } from '@/lib/content';

export function UnitCard({ unit }: { unit: Unit }) {
  return (
    <Link
      href={`/unit/${unit.id}`}
      className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 card-hover focus:outline-none focus:ring-2 focus:ring-ocean"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-gray-500">Unit</p>
          <h3 className="text-xl font-semibold text-stone">{unit.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{unit.summary}</p>
        </div>
        <span className="rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean">{unit.events.length} events</span>
      </div>
      {!unit.enabled && <p className="mt-3 text-xs text-red-600">Disabled by teacher</p>}
    </Link>
  );
}
