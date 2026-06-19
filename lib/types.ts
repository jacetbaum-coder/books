export type NarrativeLabel =
  | 'first-person'
  | 'third-person-limited'
  | 'third-person-omniscient'
  | 'multiple-povs'
  | 'present-tense'
  | 'past-tense';

export type PaceLabel = 'very-slow' | 'slow' | 'medium' | 'fast' | 'very-fast';
export type StoryFocusLabel = 'character-driven' | 'plot-driven' | 'worldbuilding-driven' | 'relationship-driven';
export type EmotionalToneLabel = 'hopeful' | 'dark' | 'melancholic' | 'humorous' | 'cozy' | 'suspenseful' | 'intense';
export type ReadingExperienceLabel = 'easy-read' | 'moderate-complexity' | 'dense-prose' | 'literary' | 'experimental';
export type StructureLabel = 'linear-timeline' | 'nonlinear-timeline' | 'framed-narrative' | 'multiple-timelines';

export type BookDNA = {
  narrative: NarrativeLabel[];
  pacing: PaceLabel;
  storyFocus: StoryFocusLabel[];
  emotionalTone: EmotionalToneLabel[];
  readingExperience: ReadingExperienceLabel[];
  structure: StructureLabel[];
  dimensions: {
    emotionalIntensity: number;
    plotIntensity: number;
    characterDepth: number;
    worldbuildingDepth: number;
    romanceLevel: number;
    humorLevel: number;
    mysteryLevel: number;
    actionLevel: number;
    philosophicalDepth: number;
  };
};

export type ReviewInsights = {
  loved: string[];
  disliked: string[];
  recurringThemes: string[];
  summary: string;
};

export type TraditionalBookInfo = {
  title: string;
  author: string;
  publicationYear: number;
  pageCount: number;
  genre: string;
  subgenre: string;
  averageRating: number;
  ratingsCount: number;
  awards: string[];
  series: string | null;
  description: string;
};

export type BookRecord = {
  slug: string;
  info: TraditionalBookInfo;
  dna: BookDNA;
  reviews: ReviewInsights;
};

export type Recommendation = {
  slug: string;
  title: string;
  author: string;
  score: number;
  reasons: string[];
};
