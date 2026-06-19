# Book DNA Recommendation Engine

A Next.js + TypeScript starter for recommending books by reading experience rather than genre alone.

## What this scaffold includes

- A home page that searches by title and author.
- A book detail page that shows traditional book metadata, narrative DNA, review insights, and recommendation explanations.
- A trait search page for queries like "slow-burn character-driven novels" or "dense philosophical science fiction".
- API route placeholders for book lookup and recommendations.
- A Supabase-ready SQL schema for storing book profiles.
- OpenAI and embedding integration hooks for narrative analysis.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase/PostgreSQL
- OpenAI API

## Run locally

1. Install dependencies.
2. Copy `.env.example` to `.env.local` and fill in API keys.
3. Run `npm run dev`.

## Data model

The starter catalog lives in `lib/mock-data.ts`. The production schema is defined in `supabase/schema.sql` and includes:

- Traditional metadata such as title, author, year, page count, genre, ratings, awards, and description.
- Narrative DNA fields such as narration style, pacing, tone, structure, and reading experience.
- Review analysis fields for loved themes, disliked themes, recurring themes, and summary.

## Next steps

- Replace the mock catalog with live Open Library and Google Books lookups.
- Persist analyzed books and recommendations in Supabase.
- Swap the placeholder AI calls for scheduled ingestion and review analysis jobs.