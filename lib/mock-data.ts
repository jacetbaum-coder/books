import { BookRecord } from './types';
import { slugifyBook } from './slug';

const goldfinch: BookRecord = {
  slug: slugifyBook('The Goldfinch', 'Donna Tartt'),
  info: {
    title: 'The Goldfinch',
    author: 'Donna Tartt',
    coverUrl: 'https://covers.openlibrary.org/b/id/8359251-L.jpg',
    publicationYear: 2013,
    pageCount: 771,
    genre: 'Literary fiction',
    subgenre: 'Coming-of-age / psychological drama',
    averageRating: 3.9,
    ratingsCount: 900000,
    awards: ['Pulitzer Prize for Fiction'],
    series: null,
    description:
      'A boy survives a bombing at the Metropolitan Museum of Art and grows into a world of grief, art, guilt, and obsession.'
  },
  dna: {
    narrative: ['first-person', 'past-tense'],
    pacing: 'slow',
    storyFocus: ['character-driven'],
    emotionalTone: ['melancholic', 'dark', 'intense'],
    readingExperience: ['literary', 'dense-prose'],
    structure: ['linear-timeline', 'multiple-timelines'],
    dimensions: {
      emotionalIntensity: 9,
      plotIntensity: 5,
      characterDepth: 10,
      worldbuildingDepth: 4,
      romanceLevel: 1,
      humorLevel: 2,
      mysteryLevel: 4,
      actionLevel: 3,
      philosophicalDepth: 8
    }
  },
  reviews: {
    loved: ['Beautiful prose', 'Deep characters', 'Atmospheric setting', 'Emotional weight'],
    disliked: ['Slow pacing', 'Long length', 'Overwrought sections'],
    recurringThemes: ['Grief', 'Art', 'Obsession', 'Identity'],
    summary:
      'Readers most often respond to the novel’s immersive prose, emotional density, and lingering sadness, while some find its length and slow burn demanding.'
  }
};

const normalPeople: BookRecord = {
  slug: slugifyBook('Normal People', 'Sally Rooney'),
  info: {
    title: 'Normal People',
    author: 'Sally Rooney',
    coverUrl: 'https://covers.openlibrary.org/b/id/9251146-L.jpg',
    publicationYear: 2018,
    pageCount: 273,
    genre: 'Literary fiction',
    subgenre: 'Relationship drama',
    averageRating: 4.0,
    ratingsCount: 1300000,
    awards: ['Costa Novel Award shortlist'],
    series: null,
    description:
      'Two people move through adolescence and early adulthood in a relationship shaped by class, intimacy, and miscommunication.'
  },
  dna: {
    narrative: ['third-person-limited', 'past-tense'],
    pacing: 'medium',
    storyFocus: ['relationship-driven', 'character-driven'],
    emotionalTone: ['melancholic', 'intense'],
    readingExperience: ['literary', 'moderate-complexity'],
    structure: ['linear-timeline', 'multiple-timelines'],
    dimensions: {
      emotionalIntensity: 8,
      plotIntensity: 4,
      characterDepth: 9,
      worldbuildingDepth: 1,
      romanceLevel: 7,
      humorLevel: 3,
      mysteryLevel: 1,
      actionLevel: 1,
      philosophicalDepth: 6
    }
  },
  reviews: {
    loved: ['Sharp character work', 'Emotional realism', 'Quiet intensity'],
    disliked: ['Frustrating communication', 'Sparse plot'],
    recurringThemes: ['Intimacy', 'Class', 'Miscommunication'],
    summary: 'Readers praise the emotional accuracy and interiority, with some wishing for a more explicit plot arc.'
  }
};

const shadowOfTheWind: BookRecord = {
  slug: slugifyBook('The Shadow of the Wind', 'Carlos Ruiz Zafón'),
  info: {
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    coverUrl: 'https://covers.openlibrary.org/b/id/10521274-L.jpg',
    publicationYear: 2001,
    pageCount: 487,
    genre: 'Historical fiction',
    subgenre: 'Literary mystery',
    averageRating: 4.3,
    ratingsCount: 900000,
    awards: ['Planeta Award'],
    series: 'The Cemetery of Forgotten Books',
    description:
      'A young boy in postwar Barcelona becomes tangled in a labyrinth of books, secrets, and a writer’s vanished life.'
  },
  dna: {
    narrative: ['third-person-omniscient', 'past-tense'],
    pacing: 'medium',
    storyFocus: ['plot-driven', 'worldbuilding-driven'],
    emotionalTone: ['suspenseful', 'dark'],
    readingExperience: ['moderate-complexity', 'literary'],
    structure: ['framed-narrative', 'multiple-timelines'],
    dimensions: {
      emotionalIntensity: 7,
      plotIntensity: 8,
      characterDepth: 8,
      worldbuildingDepth: 7,
      romanceLevel: 3,
      humorLevel: 2,
      mysteryLevel: 9,
      actionLevel: 5,
      philosophicalDepth: 6
    }
  },
  reviews: {
    loved: ['Atmospheric setting', 'Gothic mystery', 'Bookish world'],
    disliked: ['Occasional melodrama', 'Complicated plotting'],
    recurringThemes: ['Memory', 'Secrets', 'Books about books'],
    summary: 'Readers love the moody atmosphere and mystery engine that runs beneath the literary surface.'
  }
};

const dune: BookRecord = {
  slug: slugifyBook('Dune', 'Frank Herbert'),
  info: {
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://covers.openlibrary.org/b/id/8101356-L.jpg',
    publicationYear: 1965,
    pageCount: 688,
    genre: 'Science fiction',
    subgenre: 'Epic political sci-fi',
    averageRating: 4.3,
    ratingsCount: 1200000,
    awards: ['Hugo Award', 'Nebula Award'],
    series: 'Dune',
    description:
      'An heir is thrust into a desert power struggle where ecology, religion, and empire collide.'
  },
  dna: {
    narrative: ['third-person-limited', 'past-tense', 'multiple-povs'],
    pacing: 'medium',
    storyFocus: ['worldbuilding-driven', 'plot-driven'],
    emotionalTone: ['intense', 'suspenseful'],
    readingExperience: ['dense-prose', 'moderate-complexity'],
    structure: ['linear-timeline'],
    dimensions: {
      emotionalIntensity: 7,
      plotIntensity: 8,
      characterDepth: 7,
      worldbuildingDepth: 10,
      romanceLevel: 2,
      humorLevel: 2,
      mysteryLevel: 5,
      actionLevel: 7,
      philosophicalDepth: 8
    }
  },
  reviews: {
    loved: ['Massive worldbuilding', 'Political intrigue', 'Iconic scope'],
    disliked: ['Dense terminology', 'Spare emotional warmth'],
    recurringThemes: ['Ecology', 'Power', 'Prophecy'],
    summary: 'Readers admire the scale and ideas, while noting that the dense setting can take effort to absorb.'
  }
};

export const bookCatalog: BookRecord[] = [goldfinch, normalPeople, shadowOfTheWind, dune];

export const bookCatalogBySlug = Object.fromEntries(bookCatalog.map((book) => [book.slug, book]));
