import { TraditionalBookInfo } from './types';

type OpenLibrarySearchDoc = {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  ratings_average?: number;
  ratings_count?: number;
  key?: string;
  subject?: string[];
};

type OpenLibrarySearchResponse = {
  docs?: OpenLibrarySearchDoc[];
};

type OpenLibraryWorkResponse = {
  description?: string | { value?: string };
  subjects?: string[];
};

type GoogleVolume = {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    description?: string;
    subtitle?: string;
  };
};

type GoogleBooksResponse = {
  items?: GoogleVolume[];
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parsePublicationYear(publishedDate: string | undefined) {
  if (!publishedDate) return 0;
  const match = publishedDate.match(/\b(\d{4})\b/);
  return match ? Number(match[1]) : 0;
}

function pickBestOpenLibraryDoc(docs: OpenLibrarySearchDoc[], title: string, author: string) {
  const titleNeedle = normalize(title);
  const authorNeedle = normalize(author);

  const scored = docs.map((doc) => {
    const docTitle = normalize(doc.title ?? '');
    const docAuthors = (doc.author_name ?? []).map(normalize);
    const titleScore = docTitle === titleNeedle ? 2 : docTitle.includes(titleNeedle) ? 1 : 0;
    const authorScore = docAuthors.some((name) => name.includes(authorNeedle)) ? 2 : 0;
    return { doc, score: titleScore + authorScore };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.doc ?? null;
}

async function fetchOpenLibraryInfo(title: string, author: string): Promise<Partial<TraditionalBookInfo> | null> {
  const searchUrl = new URL('https://openlibrary.org/search.json');
  searchUrl.searchParams.set('title', title);
  searchUrl.searchParams.set('author', author);
  searchUrl.searchParams.set('limit', '5');

  const searchResponse = await fetch(searchUrl, { next: { revalidate: 60 * 60 * 24 } });
  if (!searchResponse.ok) return null;

  const searchJson = (await searchResponse.json()) as OpenLibrarySearchResponse;
  const docs = searchJson.docs ?? [];
  if (docs.length === 0) return null;

  const best = pickBestOpenLibraryDoc(docs, title, author);
  if (!best) return null;

  let description = '';
  let subjects: string[] = best.subject ?? [];

  if (best.key) {
    const workResponse = await fetch(`https://openlibrary.org${best.key}.json`, { next: { revalidate: 60 * 60 * 24 } });
    if (workResponse.ok) {
      const workJson = (await workResponse.json()) as OpenLibraryWorkResponse;
      if (typeof workJson.description === 'string') {
        description = workJson.description;
      } else if (workJson.description?.value) {
        description = workJson.description.value;
      }
      if (workJson.subjects?.length) {
        subjects = workJson.subjects;
      }
    }
  }

  const [genre = 'Unknown', subgenre = 'General'] = subjects;

  return {
    title: best.title ?? title,
    author: best.author_name?.[0] ?? author,
    publicationYear: best.first_publish_year ?? 0,
    pageCount: best.number_of_pages_median ?? 0,
    genre,
    subgenre,
    averageRating: best.ratings_average ?? 0,
    ratingsCount: best.ratings_count ?? 0,
    awards: [],
    series: null,
    description: description.trim()
  };
}

async function fetchGoogleBooksInfo(title: string, author: string): Promise<Partial<TraditionalBookInfo> | null> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', `intitle:${title} inauthor:${author}`);
  url.searchParams.set('maxResults', '5');

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) return null;

  const json = (await response.json()) as GoogleBooksResponse;
  const volumes = json.items ?? [];
  if (volumes.length === 0) return null;

  const first = volumes[0]?.volumeInfo;
  if (!first) return null;

  const categories = first.categories ?? [];
  const [genre = 'Unknown', subgenre = 'General'] = categories;

  return {
    title: first.title ?? title,
    author: first.authors?.[0] ?? author,
    publicationYear: parsePublicationYear(first.publishedDate),
    pageCount: first.pageCount ?? 0,
    genre,
    subgenre,
    averageRating: first.averageRating ?? 0,
    ratingsCount: first.ratingsCount ?? 0,
    awards: [],
    series: first.subtitle ?? null,
    description: stripHtml(first.description ?? '')
  };
}

function chooseValue<T>(...values: (T | null | undefined)[]) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim().length === 0) continue;
    if (typeof value === 'number' && value === 0) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    return value;
  }
  return values[0] ?? null;
}

export async function fetchExternalBookInfo(title: string, author: string): Promise<TraditionalBookInfo | null> {
  const [openLibrary, googleBooks] = await Promise.allSettled([fetchOpenLibraryInfo(title, author), fetchGoogleBooksInfo(title, author)]);

  const ol = openLibrary.status === 'fulfilled' ? openLibrary.value : null;
  const gb = googleBooks.status === 'fulfilled' ? googleBooks.value : null;

  if (!ol && !gb) return null;

  const merged: TraditionalBookInfo = {
    title: (chooseValue(ol?.title, gb?.title, title) as string) ?? title,
    author: (chooseValue(ol?.author, gb?.author, author) as string) ?? author,
    publicationYear: (chooseValue(ol?.publicationYear, gb?.publicationYear, 0) as number) ?? 0,
    pageCount: (chooseValue(ol?.pageCount, gb?.pageCount, 0) as number) ?? 0,
    genre: (chooseValue(gb?.genre, ol?.genre, 'Unknown') as string) ?? 'Unknown',
    subgenre: (chooseValue(gb?.subgenre, ol?.subgenre, 'General') as string) ?? 'General',
    averageRating: (chooseValue(gb?.averageRating, ol?.averageRating, 0) as number) ?? 0,
    ratingsCount: (chooseValue(gb?.ratingsCount, ol?.ratingsCount, 0) as number) ?? 0,
    awards: [],
    series: (chooseValue(gb?.series, ol?.series, null) as string | null) ?? null,
    description:
      (chooseValue(ol?.description, gb?.description, 'No description was returned by external sources.') as string) ??
      'No description was returned by external sources.'
  };

  return merged;
}