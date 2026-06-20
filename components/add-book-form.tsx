'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugifyBook } from '@/lib/slug';
import { BookRecord } from '@/lib/types';

type Suggestion = {
  title: string;
  author: string;
  coverUrl: string | null;
};

type ReaderAssociationsForm = {
  loved: string;
  disliked: string;
  recurringThemes: string;
  summary: string;
  narrative: string;
  pacing: string;
  storyFocus: string;
  emotionalTone: string;
  readingExperience: string;
  structure: string;
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

type ReflectionForm = {
  personalRating: number;
  feltMost: string;
  notes: string;
  wouldRecommendTo: string;
  finishedOn: string;
};

const defaultAssociations: ReaderAssociationsForm = {
  loved: '',
  disliked: '',
  recurringThemes: '',
  summary: '',
  narrative: '',
  pacing: 'medium',
  storyFocus: '',
  emotionalTone: '',
  readingExperience: '',
  structure: '',
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

const defaultReflection: ReflectionForm = {
  personalRating: 0,
  feltMost: '',
  notes: '',
  wouldRecommendTo: '',
  finishedOn: ''
};

function csvToArray(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToCsv(values: string[]) {
  return values.join(', ');
}

function normalizeUrl(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    return parsed.toString();
  } catch {
    return null;
  }
}

export function AddBookForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [readerAssociations, setReaderAssociations] = useState<ReaderAssociationsForm>(defaultAssociations);
  const [reflection, setReflection] = useState<ReflectionForm>(defaultReflection);
  const [message, setMessage] = useState('');

  const canPrefill = useMemo(() => title.trim().length > 1 && author.trim().length > 1, [title, author]);

  useEffect(() => {
    const query = title.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/book-suggestions?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as { suggestions: Suggestion[] };
        setSuggestions(data.suggestions ?? []);
        setSuggestionsOpen(true);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [title]);

  async function hydrateFromBook(selectedTitle: string, selectedAuthor: string, selectedCoverUrl?: string | null) {
    setIsPrefilling(true);
    setMessage('');

    try {
      const params = new URLSearchParams({ title: selectedTitle, author: selectedAuthor });
      const response = await fetch(`/api/books?${params.toString()}`);
      if (!response.ok) {
        setMessage('Could not prefill from reader data for that title yet. You can still fill everything manually.');
        return;
      }

      const data = (await response.json()) as { book: BookRecord };
      const book = data.book;

      setAuthor(book.info.author);
      setCoverUrl(selectedCoverUrl ?? book.info.coverUrl ?? null);
      setReaderAssociations({
        loved: arrayToCsv(book.reviews.loved),
        disliked: arrayToCsv(book.reviews.disliked),
        recurringThemes: arrayToCsv(book.reviews.recurringThemes),
        summary: book.reviews.summary,
        narrative: arrayToCsv(book.dna.narrative),
        pacing: book.dna.pacing,
        storyFocus: arrayToCsv(book.dna.storyFocus),
        emotionalTone: arrayToCsv(book.dna.emotionalTone),
        readingExperience: arrayToCsv(book.dna.readingExperience),
        structure: arrayToCsv(book.dna.structure),
        dimensions: { ...book.dna.dimensions }
      });
      setReflection((current) => ({
        ...current,
        feltMost: current.feltMost || arrayToCsv(book.dna.emotionalTone)
      }));
      setMessage('Reader-association profile loaded. Edit anything to match your own experience.');
    } finally {
      setIsPrefilling(false);
    }
  }

  async function handleSuggestionPick(suggestion: Suggestion) {
    setTitle(suggestion.title);
    setAuthor(suggestion.author);
    setCoverUrl(suggestion.coverUrl);
    setSuggestionsOpen(false);
    setSuggestions([]);
    await hydrateFromBook(suggestion.title, suggestion.author, suggestion.coverUrl);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();
    if (!cleanTitle || !cleanAuthor) {
      setMessage('Title and author are required.');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const payload = {
        bookSlug: slugifyBook(cleanTitle, cleanAuthor),
        title: cleanTitle,
        author: cleanAuthor,
        coverUrl: normalizeUrl(coverUrl),
        readerAssociations: {
          loved: csvToArray(readerAssociations.loved),
          disliked: csvToArray(readerAssociations.disliked),
          recurringThemes: csvToArray(readerAssociations.recurringThemes),
          summary: readerAssociations.summary.trim(),
          narrative: csvToArray(readerAssociations.narrative),
          pacing: readerAssociations.pacing,
          storyFocus: csvToArray(readerAssociations.storyFocus),
          emotionalTone: csvToArray(readerAssociations.emotionalTone),
          readingExperience: csvToArray(readerAssociations.readingExperience),
          structure: csvToArray(readerAssociations.structure),
          dimensions: readerAssociations.dimensions
        },
        userReflection: {
          personalRating: reflection.personalRating,
          feltMost: csvToArray(reflection.feltMost),
          notes: reflection.notes.trim(),
          wouldRecommendTo: reflection.wouldRecommendTo.trim(),
          finishedOn: reflection.finishedOn || null
        }
      };

      const response = await fetch('/api/my-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorJson = (await response.json().catch(() => null)) as { error?: string } | null;
        setMessage(errorJson?.error ?? 'Save failed. Please try again.');
        return;
      }

      router.push('/my-library');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <div className="panel p-6">
        <p className="label">Step 1</p>
        <h2 className="mt-2 text-2xl font-semibold text-amber-50">Find the book</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            <label className="space-y-2">
              <span className="label">Title</span>
              <input
                className="input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onFocus={() => suggestions.length > 0 && setSuggestionsOpen(true)}
                placeholder="Start typing a title"
              />
            </label>
            {suggestionsOpen && suggestions.length > 0 && (
              <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-[#16120f] p-2 shadow-xl">
                {suggestions.map((suggestion) => (
                  <button
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/10"
                    key={`${suggestion.title}-${suggestion.author}`}
                    onClick={() => handleSuggestionPick(suggestion)}
                    type="button"
                  >
                    <span>
                      <span className="block font-medium text-amber-50">{suggestion.title}</span>
                      <span className="block text-sm text-amber-50/70">{suggestion.author}</span>
                    </span>
                    {suggestion.coverUrl ? (
                      <img alt="cover" className="h-12 w-8 rounded object-cover" src={suggestion.coverUrl} />
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="space-y-2">
            <span className="label">Author</span>
            <input className="input" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author name" />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="button-secondary" disabled={!canPrefill || isPrefilling} onClick={() => hydrateFromBook(title, author)} type="button">
            {isPrefilling ? 'Loading profile...' : 'Prefill from reader associations'}
          </button>
          {isLoadingSuggestions ? <span className="text-sm text-amber-100/70">Searching titles...</span> : null}
          {coverUrl ? <img alt="Selected book cover" className="h-20 w-14 rounded-xl object-cover" src={coverUrl} /> : null}
        </div>
      </div>

      <div className="panel p-6">
        <p className="label">Step 2</p>
        <h2 className="mt-2 text-2xl font-semibold text-amber-50">Reader associations (editable)</h2>
        <p className="mt-2 text-sm text-amber-50/75">Use comma-separated values for list fields. Everything is prefilled when possible, but you can tailor all fields.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="Readers loved" value={readerAssociations.loved} onChange={(value) => setReaderAssociations((c) => ({ ...c, loved: value }))} />
          <Input label="Readers disliked" value={readerAssociations.disliked} onChange={(value) => setReaderAssociations((c) => ({ ...c, disliked: value }))} />
          <Input
            label="Recurring themes"
            value={readerAssociations.recurringThemes}
            onChange={(value) => setReaderAssociations((c) => ({ ...c, recurringThemes: value }))}
          />
          <Input label="Narrative" value={readerAssociations.narrative} onChange={(value) => setReaderAssociations((c) => ({ ...c, narrative: value }))} />
          <Input label="Story focus" value={readerAssociations.storyFocus} onChange={(value) => setReaderAssociations((c) => ({ ...c, storyFocus: value }))} />
          <Input
            label="Emotional tone"
            value={readerAssociations.emotionalTone}
            onChange={(value) => setReaderAssociations((c) => ({ ...c, emotionalTone: value }))}
          />
          <Input
            label="Reading experience"
            value={readerAssociations.readingExperience}
            onChange={(value) => setReaderAssociations((c) => ({ ...c, readingExperience: value }))}
          />
          <Input label="Structure" value={readerAssociations.structure} onChange={(value) => setReaderAssociations((c) => ({ ...c, structure: value }))} />
          <label className="space-y-2">
            <span className="label">Pacing</span>
            <select
              className="input"
              value={readerAssociations.pacing}
              onChange={(event) => setReaderAssociations((c) => ({ ...c, pacing: event.target.value }))}
            >
              <option value="very-slow">very-slow</option>
              <option value="slow">slow</option>
              <option value="medium">medium</option>
              <option value="fast">fast</option>
              <option value="very-fast">very-fast</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="label">Reader summary</span>
          <textarea
            className="input min-h-24"
            value={readerAssociations.summary}
            onChange={(event) => setReaderAssociations((c) => ({ ...c, summary: event.target.value }))}
          />
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Object.entries(readerAssociations.dimensions).map(([key, value]) => (
            <label className="space-y-2" key={key}>
              <span className="label">{key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span>
              <input
                className="w-full"
                max={10}
                min={0}
                onChange={(event) =>
                  setReaderAssociations((current) => ({
                    ...current,
                    dimensions: {
                      ...current.dimensions,
                      [key]: Number(event.target.value)
                    }
                  }))
                }
                step={1}
                type="range"
                value={value}
              />
              <p className="text-xs text-amber-100/75">{value}/10</p>
            </label>
          ))}
        </div>
      </div>

      <div className="panel p-6">
        <p className="label">Step 3</p>
        <h2 className="mt-2 text-2xl font-semibold text-amber-50">Your reflection</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="How you felt most" value={reflection.feltMost} onChange={(value) => setReflection((c) => ({ ...c, feltMost: value }))} />
          <Input
            label="Who you would recommend it to"
            value={reflection.wouldRecommendTo}
            onChange={(value) => setReflection((c) => ({ ...c, wouldRecommendTo: value }))}
          />
          <label className="space-y-2">
            <span className="label">Finished on</span>
            <input
              className="input"
              type="date"
              value={reflection.finishedOn}
              onChange={(event) => setReflection((c) => ({ ...c, finishedOn: event.target.value }))}
            />
          </label>
          <label className="space-y-2">
            <span className="label">Personal rating ({reflection.personalRating}/10)</span>
            <input
              className="w-full"
              max={10}
              min={0}
              step={1}
              type="range"
              value={reflection.personalRating}
              onChange={(event) => setReflection((c) => ({ ...c, personalRating: Number(event.target.value) }))}
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="label">Notes</span>
          <textarea className="input min-h-28" value={reflection.notes} onChange={(event) => setReflection((c) => ({ ...c, notes: event.target.value }))} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button className="button-primary" disabled={isSaving} type="submit">
          {isSaving ? 'Saving to library...' : 'Save to My Library'}
        </button>
        {message ? <p className="text-sm text-amber-100/80">{message}</p> : null}
      </div>
    </form>
  );
}

function Input({ label, onChange, value }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="label">{label}</span>
      <input className="input" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
