import { BookDNA, Recommendation, BookRecord } from './types';
import { bookCatalog } from './mock-data';

function overlapScore(source: string[], target: string[]) {
  const shared = source.filter((item) => target.includes(item));
  const universe = new Set([...source, ...target]).size || 1;
  return shared.length / universe;
}

function scoreDNA(source: BookDNA, candidate: BookDNA) {
  const narrative = overlapScore(source.narrative, candidate.narrative);
  const emotionalTone = overlapScore(source.emotionalTone, candidate.emotionalTone);
  const pacing = 1 - Math.abs(pacingValue(source.pacing) - pacingValue(candidate.pacing)) / 4;
  const structure = overlapScore(source.structure, candidate.structure);
  const reviewThemes = 0.5;
  const genre = 0.5;

  const weighted = narrative * 0.3 + emotionalTone * 0.25 + pacing * 0.15 + structure * 0.1 + reviewThemes * 0.1 + genre * 0.1;

  const traitSupport = {
    narrative,
    emotionalTone,
    pacing,
    structure
  };

  return {
    score: Math.round(weighted * 100),
    traitSupport
  };
}

function pacingValue(pacing: BookDNA['pacing']) {
  const mapping = {
    'very-slow': 0,
    slow: 1,
    medium: 2,
    fast: 3,
    'very-fast': 4
  } as const;

  return mapping[pacing];
}

export function buildRecommendations(book: BookRecord, candidates: BookRecord[] = bookCatalog): Recommendation[] {
  return candidates
    .filter((candidate) => candidate.slug !== book.slug)
    .map((candidate) => {
      const scoreDNAResult = scoreDNA(book.dna, candidate.dna);
      const reasons = [] as string[];

      if (scoreDNAResult.traitSupport.narrative > 0) {
        reasons.push(`Shares narration style: ${candidate.dna.narrative.join(', ')}`);
      }
      if (scoreDNAResult.traitSupport.emotionalTone > 0) {
        reasons.push(`Matches tone: ${candidate.dna.emotionalTone.join(', ')}`);
      }
      if (scoreDNAResult.traitSupport.pacing > 0.5) {
        reasons.push(`Similar pacing: ${candidate.dna.pacing.replace('-', ' ')}`);
      }
      if (scoreDNAResult.traitSupport.structure > 0) {
        reasons.push(`Similar structure: ${candidate.dna.structure.join(', ')}`);
      }
      if (candidate.reviews.recurringThemes.length > 0) {
        reasons.push(`Reader themes include ${candidate.reviews.recurringThemes.join(', ')}`);
      }

      return {
        slug: candidate.slug,
        title: candidate.info.title,
        author: candidate.info.author,
        score: scoreDNAResult.score,
        reasons: reasons.slice(0, 4)
      };
    })
    .sort((left, right) => right.score - left.score);
}
