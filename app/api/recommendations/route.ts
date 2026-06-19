import { NextResponse } from 'next/server';
import { buildRecommendations } from '@/lib/recommendation-engine';
import { resolveBookRecordByTitleAuthor } from '@/lib/book-resolver';
import { listCachedBooks } from '@/lib/book-repository';
import { bookCatalog } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') ?? '').trim();
  const author = (searchParams.get('author') ?? '').trim();

  if (!title || !author) {
    return NextResponse.json({ error: 'Both title and author are required.' }, { status: 400 });
  }

  const resolved = await resolveBookRecordByTitleAuthor(title, author);
  if (!resolved) {
    return NextResponse.json({ error: 'Book not found in external sources.' }, { status: 404 });
  }

  const cached = await listCachedBooks(150);
  const candidateMap = new Map([...bookCatalog, ...cached].map((book) => [book.slug, book]));
  const candidates = Array.from(candidateMap.values());

  return NextResponse.json({
    recommendations: buildRecommendations(resolved.book, candidates),
    source: resolved.source
  });
}
