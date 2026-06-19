'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalMemory } from './local-memory-provider';

type Props = {
  initialQuery: string;
};

export function TraitSearchForm({ initialQuery }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const { hydrated, recentTraitQueries, rememberTraitQuery } = useLocalMemory();

  useEffect(() => {
    if (!hydrated || initialQuery || !recentTraitQueries.length) return;
    setQuery(recentTraitQueries[0].query);
  }, [hydrated, initialQuery, recentTraitQueries]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    rememberTraitQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form className="panel p-6" onSubmit={handleSubmit}>
      <label className="space-y-2">
        <span className="label">Describe the reading experience</span>
        <input className="input" value={query} name="q" onChange={(event) => setQuery(event.target.value)} placeholder="slow-burn character-driven literary fiction with melancholy atmosphere" />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        {['slow-burn', 'character-driven', 'melancholy', 'multiple POV', 'dense prose', 'philosophical'].map((example) => (
          <button
            key={example}
            className="chip transition hover:bg-white/15"
            type="button"
            onClick={() => setQuery(example)}
          >
            {example}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <button className="button-primary" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}