import Link from 'next/link';
import { listMyLibraryEntries } from '@/lib/my-library-repository';

export const dynamic = 'force-dynamic';

export default async function MyLibraryPage() {
  const entries = await listMyLibraryEntries(200);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-10 lg:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Personal catalog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-amber-50">My Library</h1>
          <p className="mt-3 max-w-3xl text-amber-50/78">Every book you logged, with covers, community profile traits, and your own reflection.</p>
        </div>
        <Link className="button-primary" href="/add-book">
          Add another book
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="panel p-8">
          <p className="text-lg text-amber-50">No books yet.</p>
          <p className="mt-2 text-amber-50/70">Add your first entry and it will appear here in a visual shelf layout.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <article className="panel overflow-hidden" key={entry.id}>
              <div className="relative h-52 w-full bg-black/30">
                {entry.coverUrl ? (
                  <img alt={`${entry.title} cover`} className="h-full w-full object-cover" src={entry.coverUrl} />
                ) : (
                  <div className="flex h-full items-center justify-center text-amber-100/45">No cover</div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">Personal rating</p>
                  <p className="text-lg font-semibold text-amber-50">{entry.userReflection.personalRating}/10</p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-2xl font-semibold text-amber-50">{entry.title}</h2>
                  <p className="mt-1 text-amber-50/72">{entry.author}</p>
                  <p className="mt-2 text-xs text-amber-100/60">Added {new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>

                <section className="space-y-2">
                  <p className="label">Reader associations</p>
                  <p className="text-sm leading-6 text-amber-50/80">{entry.readerAssociations.summary || 'No summary provided.'}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.readerAssociations.recurringThemes.slice(0, 4).map((theme) => (
                      <span className="chip" key={theme}>
                        {theme}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-2">
                  <p className="label">Your reflection</p>
                  <p className="text-sm text-amber-50/80">{entry.userReflection.notes || 'No notes yet.'}</p>
                  {entry.userReflection.wouldRecommendTo ? (
                    <p className="text-sm text-amber-50/70">Best for: {entry.userReflection.wouldRecommendTo}</p>
                  ) : null}
                </section>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
