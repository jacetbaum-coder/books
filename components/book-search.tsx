'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugifyBook } from '@/lib/slug';
import { useLocalMemory } from './local-memory-provider';

const exampleTraits = [
  'Slow-burn character-driven novels',
  'First-person literary fiction',
  'Books with melancholy atmosphere',
  'Multiple POV fantasy',
  'Dense philosophical science fiction'
];

export function BookSearch() {
  const router = useRouter();
  const [title, setTitle] = useState('The Goldfinch');
  const [author, setAuthor] = useState('Donna Tartt');
  const { hydrated, recentSearches, rememberSearch } = useLocalMemory();

  useEffect(() => {
    if (!hydrated || recentSearches.length === 0) return;
    setTitle((current) => (current === 'The Goldfinch' ? recentSearches[0].title : current));
    setAuthor((current) => (current === 'Donna Tartt' ? recentSearches[0].author : current));
  }, [hydrated, recentSearches]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = slugifyBook(title, author);
    const params = new URLSearchParams({ title, author });
    rememberSearch({ slug, title, author });
    router.push(`/books/${slug}?${params.toString()}`);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Book title</span>
          <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The Goldfinch" />
        </label>
        <label className="space-y-2">
          <span className="label">Author</span>
          <input className="input" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Donna Tartt" />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="button-primary" type="submit">
          Analyze reading experience
        </button>
        <a className="button-secondary" href="#examples">
          Browse trait examples
        </a>
      </div>
      <div className="flex flex-wrap gap-2" id="examples">
        {exampleTraits.map((trait) => (
          <span key={trait} className="chip">
            {trait}
          </span>
        ))}
      </div>
    </form>
  );
}
