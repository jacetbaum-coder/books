import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

type Suggestion = {
  title: string;
  author: string;
  coverUrl: string | null;
};

type OpenLibraryDoc = {
  title?: string;
  author_name?: string[];
  cover_i?: number;
};

type OpenLibrarySearchResponse = {
  docs?: OpenLibraryDoc[];
};

async function getCachedSuggestions(query: string): Promise<Suggestion[]> {
  if (!supabaseServer) return [];

  const { data, error } = await supabaseServer
    .from('books')
    .select('title, author, cover_url')
    .ilike('title', `%${query}%`)
    .limit(8);

  if (error || !data) return [];

  return data.map((row) => ({
    title: row.title as string,
    author: row.author as string,
    coverUrl: (row.cover_url as string | null) ?? null
  }));
}

async function getOpenLibrarySuggestions(query: string): Promise<Suggestion[]> {
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('title', query);
  url.searchParams.set('limit', '8');

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 12 } });
  if (!response.ok) return [];

  const json = (await response.json()) as OpenLibrarySearchResponse;
  return (json.docs ?? [])
    .filter((doc) => doc.title && doc.author_name?.[0])
    .map((doc) => ({
      title: doc.title as string,
      author: doc.author_name?.[0] as string,
      coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null
    }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') ?? '').trim();

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const [cached, openLibrary] = await Promise.all([getCachedSuggestions(query), getOpenLibrarySuggestions(query)]);

  const deduped = new Map<string, Suggestion>();
  for (const item of [...cached, ...openLibrary]) {
    const key = `${item.title.toLowerCase()}::${item.author.toLowerCase()}`;
    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  }

  return NextResponse.json({ suggestions: Array.from(deduped.values()).slice(0, 10) });
}
