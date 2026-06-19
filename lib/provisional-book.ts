import { slugifyBook } from './slug';
import { BookDNA, BookRecord, EmotionalToneLabel, TraditionalBookInfo } from './types';

function inferTone(description: string): EmotionalToneLabel[] {
  const text = description.toLowerCase();
  const tones: EmotionalToneLabel[] = [];

  if (/(murder|crime|threat|danger|secret|mystery|war)/.test(text)) tones.push('suspenseful');
  if (/(grief|loss|sad|heartbreak|melanch)/.test(text)) tones.push('melancholic');
  if (/(humor|funny|satire|comic)/.test(text)) tones.push('humorous');
  if (/(dark|violent|bleak|haunting)/.test(text)) tones.push('dark');
  if (/(hope|uplift|warm|friendship)/.test(text)) tones.push('hopeful');

  if (tones.length === 0) {
    tones.push('intense');
  }

  return tones;
}

function buildDefaultDna(description: string): BookDNA {
  const lower = description.toLowerCase();
  const worldbuildingHeavy = /(kingdom|planet|world|empire|magic|civilization|society)/.test(lower);
  const relationshipHeavy = /(relationship|marriage|love|family|friendship)/.test(lower);

  return {
    narrative: ['third-person-limited', 'past-tense'],
    pacing: 'medium',
    storyFocus: worldbuildingHeavy ? ['worldbuilding-driven', 'plot-driven'] : relationshipHeavy ? ['relationship-driven', 'character-driven'] : ['character-driven', 'plot-driven'],
    emotionalTone: inferTone(description),
    readingExperience: ['moderate-complexity'],
    structure: ['linear-timeline'],
    dimensions: {
      emotionalIntensity: 6,
      plotIntensity: 6,
      characterDepth: 6,
      worldbuildingDepth: worldbuildingHeavy ? 8 : 4,
      romanceLevel: relationshipHeavy ? 7 : 3,
      humorLevel: 3,
      mysteryLevel: /(mystery|secret|investig)/.test(lower) ? 7 : 4,
      actionLevel: /(battle|war|fight|chase|survival)/.test(lower) ? 7 : 4,
      philosophicalDepth: /(philosoph|ethic|identity|existential)/.test(lower) ? 7 : 5
    }
  };
}

export function buildProvisionalBookRecord(info: TraditionalBookInfo): BookRecord {
  return {
    slug: slugifyBook(info.title, info.author),
    info,
    dna: buildDefaultDna(info.description),
    reviews: {
      loved: ['Compelling premise', 'Memorable voice'],
      disliked: ['Pacing may vary by reader'],
      recurringThemes: [info.genre, info.subgenre].filter(Boolean),
      summary:
        'This profile is based on external metadata. Detailed review-theme analysis will improve once user reviews are ingested.'
    }
  };
}