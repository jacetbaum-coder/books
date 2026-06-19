import { BookRecord } from '@/lib/types';

type Props = {
  book: BookRecord;
};

function TraitGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="panel p-5">
      <p className="label">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="chip">
            {value.replace(/-/g, ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}

function DimensionBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-amber-50/82">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div className="h-2 rounded-full bg-gradient-to-r from-ember-400 to-amber-200" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

export function BookProfile({ book }: Props) {
  const { info, dna, reviews } = book;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div className="panel p-7">
          <p className="label">Traditional info</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-amber-50 md:text-5xl">{info.title}</h1>
          <p className="mt-2 text-lg text-amber-50/80">{info.author}</p>
          <p className="mt-6 max-w-3xl text-base leading-7 text-amber-50/82">{info.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Stat label="Publication year" value={String(info.publicationYear)} />
            <Stat label="Page count" value={String(info.pageCount)} />
            <Stat label="Genre" value={info.genre} />
            <Stat label="Subgenre" value={info.subgenre} />
            <Stat label="Average rating" value={`${info.averageRating.toFixed(1)} / 5`} />
            <Stat label="Ratings count" value={info.ratingsCount.toLocaleString()} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TraitGroup title="Readers loved" values={reviews.loved} />
          <TraitGroup title="Readers disliked" values={reviews.disliked} />
        </div>

        <div className="panel p-5">
          <p className="label">Review summary</p>
          <p className="mt-3 text-amber-50/82">{reviews.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {reviews.recurringThemes.map((theme) => (
              <span key={theme} className="chip">
                {theme}
              </span>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="panel p-5">
          <p className="label">Narrative style</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {dna.narrative.map((item) => (
              <span key={item} className="chip">
                {item.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-amber-50/90">Pacing: {dna.pacing.replace(/-/g, ' ')}</p>
            <p className="text-sm font-medium text-amber-50/90">Story focus: {dna.storyFocus.map((value) => value.replace(/-/g, ' ')).join(', ')}</p>
            <p className="text-sm font-medium text-amber-50/90">Tone: {dna.emotionalTone.map((value) => value.replace(/-/g, ' ')).join(', ')}</p>
            <p className="text-sm font-medium text-amber-50/90">Reading experience: {dna.readingExperience.map((value) => value.replace(/-/g, ' ')).join(', ')}</p>
            <p className="text-sm font-medium text-amber-50/90">Structure: {dna.structure.map((value) => value.replace(/-/g, ' ')).join(', ')}</p>
          </div>
        </div>

        <div className="panel p-5">
          <p className="label">Dimension scores</p>
          <div className="mt-4 space-y-4">
            <DimensionBar label="Emotional intensity" value={dna.dimensions.emotionalIntensity} />
            <DimensionBar label="Plot intensity" value={dna.dimensions.plotIntensity} />
            <DimensionBar label="Character depth" value={dna.dimensions.characterDepth} />
            <DimensionBar label="Worldbuilding depth" value={dna.dimensions.worldbuildingDepth} />
            <DimensionBar label="Romance level" value={dna.dimensions.romanceLevel} />
            <DimensionBar label="Humor level" value={dna.dimensions.humorLevel} />
            <DimensionBar label="Mystery level" value={dna.dimensions.mysteryLevel} />
            <DimensionBar label="Action level" value={dna.dimensions.actionLevel} />
            <DimensionBar label="Philosophical depth" value={dna.dimensions.philosophicalDepth} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-amber-200/65">{label}</p>
      <p className="mt-2 text-sm font-medium text-amber-50">{value}</p>
    </div>
  );
}
