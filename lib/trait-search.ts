import { bookCatalog } from './mock-data';
import { BookRecord } from './types';

export type TraitSearchResult = BookRecord & { score: number; matches: string[] };

export function searchByTraits(query: string): TraitSearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/[,\s]+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return bookCatalog.map((book) => ({ ...book, score: 0, matches: [] }));
  }

  return bookCatalog
    .map((book) => {
      const haystack = [
        book.info.genre,
        book.info.subgenre,
        book.info.description,
        book.reviews.summary,
        ...book.reviews.recurringThemes,
        ...book.dna.narrative,
        book.dna.pacing,
        ...book.dna.storyFocus,
        ...book.dna.emotionalTone,
        ...book.dna.readingExperience,
        ...book.dna.structure
      ]
        .join(' ')
        .toLowerCase();

      const matches = terms.filter((term) => haystack.includes(term));
      const score = matches.length ? Math.round((matches.length / terms.length) * 100) : 0;

      return { ...book, score, matches };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score);
}
