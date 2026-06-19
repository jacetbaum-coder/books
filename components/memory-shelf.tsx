'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useLocalMemory } from './local-memory-provider';

function bookHref(slug: string, title: string, author: string) {
  const params = new URLSearchParams({ title, author });
  return `/books/${slug}?${params.toString()}` as Route;
}

export function MemoryShelf() {
  const { hydrated, recentSearches, recentTraitQueries, recentlyViewed, library, clearMemory } = useLocalMemory();

  if (!hydrated) {
    return (
      <section className="panel p-6">
        <p className="label">Local memory</p>
        <p className="mt-3 text-sm text-amber-50/72">Loading browser memory…</p>
      </section>
    );
  }

  const savedBooks = library.filter((entry) => entry.saved || entry.favorite || entry.read).slice(0, 6);

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label">Local memory</p>
          <h2 className="mt-2 text-2xl font-semibold text-amber-50">Your browser remembers your reading trail</h2>
        </div>
        <button className="button-secondary" type="button" onClick={clearMemory}>
          Clear local memory
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <p className="label">Recently viewed</p>
          <div className="mt-4 space-y-3">
            {recentlyViewed.length ? (
              recentlyViewed.slice(0, 5).map((book) => (
                <Link key={book.slug} className="block rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10" href={bookHref(book.slug, book.title, book.author)}>
                  <p className="font-medium text-amber-50">{book.title}</p>
                  <p className="text-sm text-amber-50/70">{book.author}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-amber-50/72">Open a few book pages and they will stay here after reload.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <p className="label">Recent searches</p>
          <div className="mt-4 space-y-3">
            {recentSearches.length ? (
              recentSearches.slice(0, 5).map((search) => (
                <Link key={`${search.slug}-${search.searchedAt}`} className="block rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10" href={bookHref(search.slug, search.title, search.author)}>
                  <p className="font-medium text-amber-50">{search.title}</p>
                  <p className="text-sm text-amber-50/70">{search.author}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-amber-50/72">Book title and author searches will persist here locally.</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {recentTraitQueries.slice(0, 4).map((item) => (
              <Link key={`${item.query}-${item.searchedAt}`} className="chip hover:bg-white/15" href={`/search?q=${encodeURIComponent(item.query)}` as Route}>
                {item.query}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <p className="label">Local library</p>
          <div className="mt-4 space-y-3">
            {savedBooks.length ? (
              savedBooks.map((entry) => (
                <Link key={entry.slug} className="block rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10" href={bookHref(entry.slug, entry.title, entry.author)}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-amber-50">{entry.title}</p>
                      <p className="text-sm text-amber-50/70">{entry.author}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-amber-50/80">
                      {entry.saved ? <span className="chip">Saved</span> : null}
                      {entry.read ? <span className="chip">Read</span> : null}
                      {entry.favorite ? <span className="chip">Favorite</span> : null}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-amber-50/72">Mark a book as saved, read, or favorite to keep a personal local library without logging in.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}