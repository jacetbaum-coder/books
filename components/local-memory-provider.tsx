'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'book-dna-local-memory-v1';

export type LocalBookSummary = {
  slug: string;
  title: string;
  author: string;
};

type RecentSearch = LocalBookSummary & {
  searchedAt: string;
};

type RecentTraitQuery = {
  query: string;
  searchedAt: string;
};

type ViewedBook = LocalBookSummary & {
  viewedAt: string;
};

type LibraryEntry = LocalBookSummary & {
  saved: boolean;
  read: boolean;
  favorite: boolean;
  updatedAt: string;
};

type LocalMemoryState = {
  recentSearches: RecentSearch[];
  recentTraitQueries: RecentTraitQuery[];
  recentlyViewed: ViewedBook[];
  library: LibraryEntry[];
};

type LocalMemoryContextValue = LocalMemoryState & {
  hydrated: boolean;
  rememberSearch: (book: LocalBookSummary) => void;
  rememberTraitQuery: (query: string) => void;
  rememberViewedBook: (book: LocalBookSummary) => void;
  toggleSaved: (book: LocalBookSummary) => void;
  toggleRead: (book: LocalBookSummary) => void;
  toggleFavorite: (book: LocalBookSummary) => void;
  getLibraryEntry: (slug: string) => LibraryEntry | undefined;
  clearMemory: () => void;
};

const initialState: LocalMemoryState = {
  recentSearches: [],
  recentTraitQueries: [],
  recentlyViewed: [],
  library: []
};

const LocalMemoryContext = createContext<LocalMemoryContextValue | null>(null);

function dedupeBySlug<T extends { slug: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) {
      return false;
    }
    seen.add(item.slug);
    return true;
  });
}

function dedupeByQuery(items: RecentTraitQuery[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.query.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function upsertLibraryEntry(entries: LibraryEntry[], book: LocalBookSummary, mutate: (entry: LibraryEntry) => LibraryEntry) {
  const current = entries.find((entry) => entry.slug === book.slug) ?? {
    ...book,
    saved: false,
    read: false,
    favorite: false,
    updatedAt: new Date().toISOString()
  };

  const next = mutate({ ...current, ...book, updatedAt: new Date().toISOString() });
  const rest = entries.filter((entry) => entry.slug !== book.slug);
  return [next, ...rest].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function LocalMemoryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LocalMemoryState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LocalMemoryState>;
        setState({
          recentSearches: parsed.recentSearches ?? [],
          recentTraitQueries: parsed.recentTraitQueries ?? [],
          recentlyViewed: parsed.recentlyViewed ?? [],
          library: parsed.library ?? []
        });
      }
    } catch {
      setState(initialState);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const rememberSearch = useCallback((book: LocalBookSummary) => {
    setState((current) => ({
      ...current,
      recentSearches: dedupeBySlug([{ ...book, searchedAt: new Date().toISOString() }, ...current.recentSearches]).slice(0, 8)
    }));
  }, []);

  const rememberTraitQuery = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setState((current) => ({
      ...current,
      recentTraitQueries: dedupeByQuery([{ query: trimmed, searchedAt: new Date().toISOString() }, ...current.recentTraitQueries]).slice(0, 8)
    }));
  }, []);

  const rememberViewedBook = useCallback((book: LocalBookSummary) => {
    setState((current) => ({
      ...current,
      recentlyViewed: dedupeBySlug([{ ...book, viewedAt: new Date().toISOString() }, ...current.recentlyViewed]).slice(0, 12)
    }));
  }, []);

  const toggleSaved = useCallback((book: LocalBookSummary) => {
    setState((current) => ({
      ...current,
      library: upsertLibraryEntry(current.library, book, (entry) => ({ ...entry, saved: !entry.saved }))
    }));
  }, []);

  const toggleRead = useCallback((book: LocalBookSummary) => {
    setState((current) => ({
      ...current,
      library: upsertLibraryEntry(current.library, book, (entry) => ({ ...entry, read: !entry.read }))
    }));
  }, []);

  const toggleFavorite = useCallback((book: LocalBookSummary) => {
    setState((current) => ({
      ...current,
      library: upsertLibraryEntry(current.library, book, (entry) => ({ ...entry, favorite: !entry.favorite, saved: entry.favorite ? entry.saved : true }))
    }));
  }, []);

  const getLibraryEntry = useCallback((slug: string) => state.library.find((entry) => entry.slug === slug), [state.library]);

  const clearMemory = useCallback(() => setState(initialState), []);

  const value = useMemo<LocalMemoryContextValue>(
    () => ({
      ...state,
      hydrated,
      rememberSearch,
      rememberTraitQuery,
      rememberViewedBook,
      toggleSaved,
      toggleRead,
      toggleFavorite,
      getLibraryEntry,
      clearMemory
    }),
    [clearMemory, getLibraryEntry, hydrated, rememberSearch, rememberTraitQuery, rememberViewedBook, state, toggleFavorite, toggleRead, toggleSaved]
  );

  return <LocalMemoryContext.Provider value={value}>{children}</LocalMemoryContext.Provider>;
}

export function useLocalMemory() {
  const context = useContext(LocalMemoryContext);
  if (!context) {
    throw new Error('useLocalMemory must be used within LocalMemoryProvider');
  }

  return context;
}