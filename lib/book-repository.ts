import { BookRecord } from './types';
import { supabaseServer } from './supabase';

type BookRow = {
  slug: string;
  title: string;
  author: string;
  publication_year: number;
  page_count: number;
  genre: string;
  subgenre: string;
  average_rating: number;
  ratings_count: number;
  awards: string[];
  series: string | null;
  description: string;
  narrative: string[];
  pacing: string;
  story_focus: string[];
  emotional_tone: string[];
  reading_experience: string[];
  structure: string[];
  emotional_intensity: number;
  plot_intensity: number;
  character_depth: number;
  worldbuilding_depth: number;
  romance_level: number;
  humor_level: number;
  mystery_level: number;
  action_level: number;
  philosophical_depth: number;
  review_loved: string[];
  review_disliked: string[];
  recurring_themes: string[];
  review_summary: string;
};

function toBookRecord(row: BookRow): BookRecord {
  return {
    slug: row.slug,
    info: {
      title: row.title,
      author: row.author,
      publicationYear: row.publication_year ?? 0,
      pageCount: row.page_count ?? 0,
      genre: row.genre ?? 'Unknown',
      subgenre: row.subgenre ?? 'General',
      averageRating: row.average_rating ?? 0,
      ratingsCount: row.ratings_count ?? 0,
      awards: row.awards ?? [],
      series: row.series ?? null,
      description: row.description ?? ''
    },
    dna: {
      narrative: (row.narrative ?? []) as BookRecord['dna']['narrative'],
      pacing: (row.pacing ?? 'medium') as BookRecord['dna']['pacing'],
      storyFocus: (row.story_focus ?? []) as BookRecord['dna']['storyFocus'],
      emotionalTone: (row.emotional_tone ?? []) as BookRecord['dna']['emotionalTone'],
      readingExperience: (row.reading_experience ?? []) as BookRecord['dna']['readingExperience'],
      structure: (row.structure ?? []) as BookRecord['dna']['structure'],
      dimensions: {
        emotionalIntensity: row.emotional_intensity ?? 5,
        plotIntensity: row.plot_intensity ?? 5,
        characterDepth: row.character_depth ?? 5,
        worldbuildingDepth: row.worldbuilding_depth ?? 5,
        romanceLevel: row.romance_level ?? 5,
        humorLevel: row.humor_level ?? 5,
        mysteryLevel: row.mystery_level ?? 5,
        actionLevel: row.action_level ?? 5,
        philosophicalDepth: row.philosophical_depth ?? 5
      }
    },
    reviews: {
      loved: row.review_loved ?? [],
      disliked: row.review_disliked ?? [],
      recurringThemes: row.recurring_themes ?? [],
      summary: row.review_summary ?? ''
    }
  };
}

function toBookRow(book: BookRecord): BookRow {
  return {
    slug: book.slug,
    title: book.info.title,
    author: book.info.author,
    publication_year: book.info.publicationYear,
    page_count: book.info.pageCount,
    genre: book.info.genre,
    subgenre: book.info.subgenre,
    average_rating: book.info.averageRating,
    ratings_count: book.info.ratingsCount,
    awards: book.info.awards,
    series: book.info.series,
    description: book.info.description,
    narrative: book.dna.narrative,
    pacing: book.dna.pacing,
    story_focus: book.dna.storyFocus,
    emotional_tone: book.dna.emotionalTone,
    reading_experience: book.dna.readingExperience,
    structure: book.dna.structure,
    emotional_intensity: book.dna.dimensions.emotionalIntensity,
    plot_intensity: book.dna.dimensions.plotIntensity,
    character_depth: book.dna.dimensions.characterDepth,
    worldbuilding_depth: book.dna.dimensions.worldbuildingDepth,
    romance_level: book.dna.dimensions.romanceLevel,
    humor_level: book.dna.dimensions.humorLevel,
    mystery_level: book.dna.dimensions.mysteryLevel,
    action_level: book.dna.dimensions.actionLevel,
    philosophical_depth: book.dna.dimensions.philosophicalDepth,
    review_loved: book.reviews.loved,
    review_disliked: book.reviews.disliked,
    recurring_themes: book.reviews.recurringThemes,
    review_summary: book.reviews.summary
  };
}

export async function getBookBySlugFromCache(slug: string): Promise<BookRecord | null> {
  if (!supabaseServer) return null;

  const { data, error } = await supabaseServer.from('books').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return null;

  return toBookRecord(data as BookRow);
}

export async function upsertBookInCache(book: BookRecord): Promise<void> {
  if (!supabaseServer) return;

  const row = toBookRow(book);
  await supabaseServer.from('books').upsert(row, { onConflict: 'slug' });
}

export async function listCachedBooks(limit = 100): Promise<BookRecord[]> {
  if (!supabaseServer) return [];

  const { data, error } = await supabaseServer.from('books').select('*').limit(limit);
  if (error || !data) return [];

  return (data as BookRow[]).map(toBookRecord);
}