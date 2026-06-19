import { NextResponse } from 'next/server';
import { resolveBookRecordByTitleAuthor } from '@/lib/book-resolver';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') ?? '').trim();
  const author = (searchParams.get('author') ?? '').trim();

  if (!title || !author) {
    return NextResponse.json({ error: 'Both title and author are required.' }, { status: 400 });
  }

  const result = await resolveBookRecordByTitleAuthor(title, author);
  if (!result) {
    return NextResponse.json({ error: 'Book not found in external sources.' }, { status: 404 });
  }

  return NextResponse.json(result);
}
