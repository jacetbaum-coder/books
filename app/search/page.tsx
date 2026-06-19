import Link from 'next/link';
import { searchByTraits } from '@/lib/trait-search';

export default async function TraitSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? '';
  const results = searchByTraits(query);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-10 lg:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Trait search</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-amber-50">Search by reading experience</h1>
        </div>
        <Link className="button-secondary" href="/">
          Back to home
        </Link>
      </div>

      <form className="panel p-6" action="/search" method="get">
        <label className="space-y-2">
          <span className="label">Describe the reading experience</span>
          <input className="input" defaultValue={query} name="q" placeholder="slow-burn character-driven literary fiction with melancholy atmosphere" />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {['slow-burn', 'character-driven', 'melancholy', 'multiple POV', 'dense prose', 'philosophical'].map((example) => (
            <span key={example} className="chip">
              {example}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <button className="button-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      <section className="mt-8 space-y-4">
        <div>
          <p className="label">Results</p>
          <h2 className="mt-2 text-2xl font-semibold text-amber-50">{query ? `Matches for “${query}”` : 'Try a descriptive trait query above'}</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((book) => (
            <article key={book.slug} className="panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label">Trait fit</p>
                  <Link className="mt-2 block text-lg font-semibold text-amber-50 hover:text-ember-300" href={`/books/${book.slug}`}>
                    {book.info.title}
                  </Link>
                  <p className="text-sm text-amber-50/70">{book.info.author}</p>
                </div>
                <span className="chip font-semibold text-ember-200">{book.score}</span>
              </div>
              <p className="mt-4 text-sm text-amber-50/80">Matched traits: {book.matches.join(', ')}</p>
            </article>
          ))}
          {!results.length && query ? (
            <div className="panel p-5 text-amber-50/80">No matches yet. Try fewer traits or use broader terms like “melancholy” or “dense prose.”</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
