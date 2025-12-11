'use client';

import classNames from 'classnames';
import { ReactNode, useState } from 'react';

export type Tab = {
  key: string;
  label: string;
  content: ReactNode;
};

export function Tabs({ tabs, defaultKey }: { tabs: Tab[]; defaultKey?: string }) {
  const [active, setActive] = useState(defaultKey ?? tabs[0]?.key);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={classNames(
              'rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-ocean',
              active === tab.key ? 'bg-ocean text-white shadow-sm' : 'bg-white text-stone shadow-sm hover:-translate-y-0.5'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="fade-in rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}
