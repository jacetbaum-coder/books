'use client';

import { useEffect, useMemo } from 'react';
import { BookRecord } from '@/lib/types';
import { LocalBookSummary, useLocalMemory } from './local-memory-provider';

type Props = {
  book: BookRecord;
};

function toSummary(book: BookRecord): LocalBookSummary {
  return {
    slug: book.slug,
    title: book.info.title,
    author: book.info.author
  };
}

export function BookMemoryControls({ book }: Props) {
  const summary = useMemo(() => toSummary(book), [book]);
  const { hydrated, rememberViewedBook, toggleSaved, toggleRead, toggleFavorite, getLibraryEntry } = useLocalMemory();

  useEffect(() => {
    if (!hydrated) return;
    rememberViewedBook(summary);
  }, [hydrated, rememberViewedBook, summary]);

  const entry = hydrated ? getLibraryEntry(book.slug) : undefined;

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label">Local memory</p>
          <h2 className="mt-2 text-xl font-semibold text-amber-50">Keep this book in your browser-only library</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-50/72">
            This state stays on this device after reload and does not require an account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button-secondary" type="button" onClick={() => toggleSaved(summary)}>
            {entry?.saved ? 'Saved' : 'Save book'}
          </button>
          <button className="button-secondary" type="button" onClick={() => toggleRead(summary)}>
            {entry?.read ? 'Read' : 'Mark read'}
          </button>
          <button className="button-primary" type="button" onClick={() => toggleFavorite(summary)}>
            {entry?.favorite ? 'Favorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </section>
  );
}