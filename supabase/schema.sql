create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  author text not null,
  cover_url text,
  publication_year integer,
  page_count integer,
  genre text,
  subgenre text,
  average_rating numeric(3, 2),
  ratings_count integer,
  awards text[] default '{}'::text[],
  series text,
  description text,
  narrative text[] default '{}'::text[],
  pacing text,
  story_focus text[] default '{}'::text[],
  emotional_tone text[] default '{}'::text[],
  reading_experience text[] default '{}'::text[],
  structure text[] default '{}'::text[],
  emotional_intensity integer,
  plot_intensity integer,
  character_depth integer,
  worldbuilding_depth integer,
  romance_level integer,
  humor_level integer,
  mystery_level integer,
  action_level integer,
  philosophical_depth integer,
  review_loved text[] default '{}'::text[],
  review_disliked text[] default '{}'::text[],
  recurring_themes text[] default '{}'::text[],
  review_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists books_slug_idx on books (slug);
create index if not exists books_title_idx on books (title);

create table if not exists my_library_entries (
  id uuid primary key default gen_random_uuid(),
  book_slug text not null,
  title text not null,
  author text not null,
  cover_url text,
  reader_associations jsonb not null default '{}'::jsonb,
  user_reflection jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists my_library_entries_book_slug_idx on my_library_entries (book_slug);
create index if not exists my_library_entries_created_at_idx on my_library_entries (created_at desc);
