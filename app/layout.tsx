import type { Metadata } from 'next';
import './globals.css';
import { LocalMemoryProvider } from '@/components/local-memory-provider';

export const metadata: Metadata = {
  title: 'Book DNA',
  description: 'Recommendation engine for the feeling of a book, not just its genre.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LocalMemoryProvider>{children}</LocalMemoryProvider>
      </body>
    </html>
  );
}
