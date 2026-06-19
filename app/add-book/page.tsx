import Link from 'next/link';
import { AddBookForm } from '@/components/add-book-form';

export default function AddBookPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-10 lg:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Personal catalog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-amber-50">Add a book to your library</h1>
          <p className="mt-3 max-w-3xl text-amber-50/78">
            Start typing a title to get instant suggestions, tap one to autofill author and reader profile traits, then fine-tune every detail with your own reflection.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="button-secondary" href="/">
            Back home
          </Link>
          <Link className="button-secondary" href="/my-library">
            View my library
          </Link>
        </div>
      </div>

      <AddBookForm />
    </main>
  );
}
