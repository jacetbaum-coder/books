import { bookCatalogBySlug } from './mock-data';
import { slugifyBook } from './slug';
import { fetchExternalBookInfo } from './book-sources';
import { buildProvisionalBookRecord } from './provisional-book';
import { BookDNA, BookRecord, ReviewInsights } from './types';
import { analyzeNarrativeDNA, summarizeReviewThemes } from './openai';
import { getBookBySlugFromCache, upsertBookInCache } from './book-repository';

type BookSource = 'starter-catalog' | 'supabase-cache' | 'external-metadata' | 'external-ai';

function isBookDNA(value: unknown): value is BookDNA {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BookDNA>;
  return (
    Array.isArray(candidate.narrative) &&
    typeof candidate.pacing === 'string' &&
    Array.isArray(candidate.storyFocus) &&
    Array.isArray(candidate.emotionalTone) &&
    Array.isArray(candidate.readingExperience) &&
    Array.isArray(candidate.structure) &&
    !!candidate.dimensions
  );
}

function isReviewInsights(value: unknown): value is ReviewInsights {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ReviewInsights>;
  return (
    Array.isArray(candidate.loved) &&
    Array.isArray(candidate.disliked) &&
    Array.isArray(candidate.recurringThemes) &&
    typeof candidate.summary === 'string'
  );
}

export async function resolveBookRecordByTitleAuthor(title: string, author: string): Promise<{ book: BookRecord; source: BookSource } | null> {
  const cleanTitle = title.trim();
  const cleanAuthor = author.trim();
  const slug = slugifyBook(cleanTitle, cleanAuthor);

  const mockBook = bookCatalogBySlug[slug];
  if (mockBook) {
    return { book: mockBook, source: 'starter-catalog' };
  }

  const cached = await getBookBySlugFromCache(slug);
  if (cached) {
    return { book: cached, source: 'supabase-cache' };
  }

  const externalInfo = await fetchExternalBookInfo(cleanTitle, cleanAuthor);
  if (!externalInfo) {
    return null;
  }

  const provisional = buildProvisionalBookRecord(externalInfo);
  let resolvedBook = provisional;
  let source: BookSource = 'external-metadata';

  const seededReviews = [externalInfo.description].filter((value) => value.trim().length > 0);

  try {
    const [aiDna, aiReviews] = await Promise.all([
      analyzeNarrativeDNA(externalInfo.description, seededReviews),
      summarizeReviewThemes(seededReviews)
    ]);

    if (isBookDNA(aiDna)) {
      resolvedBook = { ...resolvedBook, dna: aiDna };
      source = 'external-ai';
    }

    if (isReviewInsights(aiReviews)) {
      resolvedBook = { ...resolvedBook, reviews: aiReviews };
      source = source === 'external-ai' ? 'external-ai' : 'external-metadata';
    }
  } catch {
    // Best-effort enrichment. Metadata fallback remains usable if AI parsing fails.
  }

  await upsertBookInCache(resolvedBook);
  return { book: resolvedBook, source };
}