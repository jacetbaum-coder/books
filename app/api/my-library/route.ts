import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createMyLibraryEntry, listMyLibraryEntries } from '@/lib/my-library-repository';

const dimensionsSchema = z.object({
  emotionalIntensity: z.number().min(0).max(10),
  plotIntensity: z.number().min(0).max(10),
  characterDepth: z.number().min(0).max(10),
  worldbuildingDepth: z.number().min(0).max(10),
  romanceLevel: z.number().min(0).max(10),
  humorLevel: z.number().min(0).max(10),
  mysteryLevel: z.number().min(0).max(10),
  actionLevel: z.number().min(0).max(10),
  philosophicalDepth: z.number().min(0).max(10)
});

const createEntrySchema = z.object({
  bookSlug: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  coverUrl: z
    .union([z.string().url(), z.literal(''), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'string' && value.trim().length === 0 ? null : (value ?? null))),
  readerAssociations: z.object({
    loved: z.array(z.string()),
    disliked: z.array(z.string()),
    recurringThemes: z.array(z.string()),
    summary: z.string(),
    narrative: z.array(z.string()),
    pacing: z.string(),
    storyFocus: z.array(z.string()),
    emotionalTone: z.array(z.string()),
    readingExperience: z.array(z.string()),
    structure: z.array(z.string()),
    dimensions: dimensionsSchema
  }),
  userReflection: z.object({
    personalRating: z.number().min(0).max(10),
    feltMost: z.array(z.string()),
    notes: z.string(),
    wouldRecommendTo: z.string(),
    finishedOn: z
      .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(''), z.null(), z.undefined()])
      .transform((value) => (typeof value === 'string' && value.trim().length === 0 ? null : (value ?? null)))
  })
});

export async function GET() {
  const entries = await listMyLibraryEntries();
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createEntrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await createMyLibraryEntry(parsed.data);
  if (!result.entry) {
    return NextResponse.json({ error: result.error ?? 'Unable to save library entry.' }, { status: 500 });
  }

  return NextResponse.json({ entry: result.entry }, { status: 201 });
}
