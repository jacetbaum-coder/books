import Link from 'next/link';
import { Recommendation } from '@/lib/types';

type Props = {
  recommendation: Recommendation;
};

export function RecommendationCard({ recommendation }: Props) {
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Match score</p>
          <h3 className="mt-2 text-lg font-semibold text-amber-50">
            <Link className="hover:text-ember-300" href={`/books/${recommendation.slug}`}>
              {recommendation.title}
            </Link>
          </h3>
          <p className="text-sm text-amber-50/70">{recommendation.author}</p>
        </div>
        <div className="chip text-base font-semibold text-ember-200">{recommendation.score}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-amber-50/82">
        {recommendation.reasons.map((reason) => (
          <li key={reason}>• {reason}</li>
        ))}
      </ul>
    </article>
  );
}
