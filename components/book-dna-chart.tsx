'use client';

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { BookDNA } from '@/lib/types';

type Props = {
  dna: BookDNA;
};

export function BookDnaChart({ dna }: Props) {
  const data = [
    { axis: 'Emotion', value: dna.dimensions.emotionalIntensity },
    { axis: 'Plot', value: dna.dimensions.plotIntensity },
    { axis: 'Character', value: dna.dimensions.characterDepth },
    { axis: 'World', value: dna.dimensions.worldbuildingDepth },
    { axis: 'Romance', value: dna.dimensions.romanceLevel },
    { axis: 'Humor', value: dna.dimensions.humorLevel },
    { axis: 'Mystery', value: dna.dimensions.mysteryLevel },
    { axis: 'Action', value: dna.dimensions.actionLevel },
    { axis: 'Philosophy', value: dna.dimensions.philosophicalDepth }
  ];

  return (
    <div className="panel h-[360px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="label">Book DNA</p>
          <h2 className="mt-2 text-xl font-semibold text-amber-50">Narrative profile</h2>
        </div>
        <span className="chip">1-10 scale</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.16)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: 'rgba(255,245,233,0.82)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'rgba(255,245,233,0.5)', fontSize: 10 }} />
          <Radar dataKey="value" stroke="#ef8040" fill="#ef8040" fillOpacity={0.22} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
