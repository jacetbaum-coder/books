import { BookSearch } from '@/components/book-search';
import { MemoryShelf } from '@/components/memory-shelf';
import { bookCatalog } from '@/lib/mock-data';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-10 lg:px-12">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-7">
          <p className="label">Book DNA Recommendation Engine</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-amber-50 md:text-7xl">
            What does it feel like to read this book?
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-amber-50/82">
            Search by title and author, then get a profile built around narrative style, emotional tone, pacing, structure, and reader reactions instead of genre alone.
          </p>
          <BookSearch />
          <div className="flex flex-wrap gap-3 pt-2">
            <Link className="button-secondary" href="/search">
              Search by traits
            </Link>
            <Link className="button-secondary" href="/add-book">
              Add to my library
            </Link>
            <Link className="button-secondary" href="/my-library">
              My library
            </Link>
          </div>
        </div>

        <div className="panel p-6">
          <p className="label">Featured book profile</p>
          <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-2xl font-semibold text-amber-50">The Goldfinch</p>
            <p className="mt-1 text-amber-50/70">Donna Tartt</p>
            <p className="mt-4 text-sm leading-6 text-amber-50/80">
              A slow, literary, emotionally dense novel with first-person narration, deep character focus, and a melancholic atmosphere.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {bookCatalog.map((book) => (
              <Link key={book.slug} className="rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:bg-white/10" href={`/books/${book.slug}`}>
                <p className="text-sm text-amber-200/70">Open profile</p>
                <p className="mt-1 font-medium text-amber-50">{book.info.title}</p>
                <p className="text-sm text-amber-50/70">{book.info.author}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8">
        <MemoryShelf />
      </div>
    </main>
  );
}
