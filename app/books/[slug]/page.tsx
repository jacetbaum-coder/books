import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookDnaChart } from '@/components/book-dna-chart';
import { BookProfile } from '@/components/book-profile';
import { RecommendationCard } from '@/components/recommendation-card';
import { bookCatalog, bookCatalogBySlug } from '@/lib/mock-data';
import { buildRecommendations } from '@/lib/recommendation-engine';
import { resolveBookRecordByTitleAuthor } from '@/lib/book-resolver';
import { listCachedBooks } from '@/lib/book-repository';

export default async function BookPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ title?: string; author?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  let book = bookCatalogBySlug[slug];

  if (!book && query.title && query.author) {
    const resolved = await resolveBookRecordByTitleAuthor(query.title, query.author);
    if (resolved) {
      book = resolved.book;
    }
  }

  if (!book) {
    notFound();
  }

  const cached = await listCachedBooks(150);
  const candidateMap = new Map([...bookCatalog, ...cached].map((candidate) => [candidate.slug, candidate]));
  const candidates = Array.from(candidateMap.values());
  const recommendations = buildRecommendations(book, candidates);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-10 lg:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Book detail</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-amber-50">Reading experience profile</h1>
        </div>
        <Link className="button-secondary" href="/">
          Back to search
        </Link>
      </div>

      <div className="space-y-8">
        <BookProfile book={book} />
        <BookDnaChart dna={book.dna} />

        <section className="space-y-4">
          <div>
            <p className="label">Narrative-based recommendations</p>
            <h2 className="mt-2 text-2xl font-semibold text-amber-50">Books with a similar reading experience</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.slug} recommendation={recommendation} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
