import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10 text-center md:px-10">
      <div className="panel w-full p-10">
        <p className="label">Not found</p>
        <h1 className="mt-3 text-4xl font-semibold text-amber-50">That book is not in the starter catalog yet.</h1>
        <p className="mt-4 text-amber-50/78">Use the home page to search by title and author, or try the trait search page for broader discovery.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="button-primary" href="/">
            Home
          </Link>
          <Link className="button-secondary" href="/search">
            Trait search
          </Link>
        </div>
      </div>
    </main>
  );
}
