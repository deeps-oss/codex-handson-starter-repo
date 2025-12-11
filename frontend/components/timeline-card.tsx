import Link from 'next/link';
import { Event } from '@/lib/content';

export function TimelineCard({ event, href }: { event: Event; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 card-hover focus:outline-none focus:ring-2 focus:ring-ocean"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">{event.years}</p>
          <h4 className="text-lg font-semibold text-stone">{event.title}</h4>
        </div>
        <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-stone">{event.region}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{event.summary}</p>
      <div className="flex flex-wrap gap-2 pt-1 text-xs">
        {event.keyTerms.map((term) => (
          <span key={term} className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
            {term}
          </span>
        ))}
      </div>
    </Link>
  );
}
