import { LibraryEntry, LibraryReaderAssociations, LibraryUserReflection } from './types';
import { supabaseServer } from './supabase';

type LibraryRow = {
  id: string;
  book_slug: string;
  title: string;
  author: string;
  cover_url: string | null;
  reader_associations: Partial<LibraryReaderAssociations> | null;
  user_reflection: Partial<LibraryUserReflection> | null;
  created_at: string;
  updated_at: string;
};

const fallbackAssociations: LibraryReaderAssociations = {
  loved: [],
  disliked: [],
  recurringThemes: [],
  summary: '',
  narrative: [],
  pacing: 'medium',
  storyFocus: [],
  emotionalTone: [],
  readingExperience: [],
  structure: [],
  dimensions: {
    emotionalIntensity: 5,
    plotIntensity: 5,
    characterDepth: 5,
    worldbuildingDepth: 5,
    romanceLevel: 5,
    humorLevel: 5,
    mysteryLevel: 5,
    actionLevel: 5,
    philosophicalDepth: 5
  }
};

const fallbackReflection: LibraryUserReflection = {
  personalRating: 0,
  feltMost: [],
  notes: '',
  wouldRecommendTo: '',
  finishedOn: null
};

function toLibraryEntry(row: LibraryRow): LibraryEntry {
  return {
    id: row.id,
    bookSlug: row.book_slug,
    title: row.title,
    author: row.author,
    coverUrl: row.cover_url,
    readerAssociations: {
      ...fallbackAssociations,
      ...(row.reader_associations ?? {}),
      dimensions: {
        ...fallbackAssociations.dimensions,
        ...(row.reader_associations?.dimensions ?? {})
      }
    },
    userReflection: {
      ...fallbackReflection,
      ...(row.user_reflection ?? {})
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listMyLibraryEntries(limit = 100): Promise<LibraryEntry[]> {
  if (!supabaseServer) return [];

  const { data, error } = await supabaseServer
    .from('my_library_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as LibraryRow[]).map(toLibraryEntry);
}

export async function createMyLibraryEntry(payload: {
  bookSlug: string;
  title: string;
  author: string;
  coverUrl: string | null;
  readerAssociations: {
    loved: string[];
    disliked: string[];
    recurringThemes: string[];
    summary: string;
    narrative: string[];
    pacing: string;
    storyFocus: string[];
    emotionalTone: string[];
    readingExperience: string[];
    structure: string[];
    dimensions: LibraryReaderAssociations['dimensions'];
  };
  userReflection: LibraryUserReflection;
}): Promise<LibraryEntry | null> {
  if (!supabaseServer) return null;

  const { data, error } = await supabaseServer
    .from('my_library_entries')
    .insert({
      book_slug: payload.bookSlug,
      title: payload.title,
      author: payload.author,
      cover_url: payload.coverUrl,
      reader_associations: payload.readerAssociations,
      user_reflection: payload.userReflection
    })
    .select('*')
    .single();

  if (error || !data) return null;
  return toLibraryEntry(data as LibraryRow);
}
