import OpenAI from 'openai';
import { BookDNA, ReviewInsights } from './types';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function analyzeNarrativeDNA(description: string, reviews: string[]): Promise<BookDNA | null> {
  if (!client) return null;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content:
          'You analyze books for reading experience. Return concise JSON with narrative, pacing, storyFocus, emotionalTone, readingExperience, structure, and dimensions.'
      },
      { role: 'user', content: `Description: ${description}\nReviews: ${reviews.join('\n')}` }
    ]
  });

  const text = response.output_text ?? '';
  return text ? (JSON.parse(text) as BookDNA) : null;
}

export async function summarizeReviewThemes(reviews: string[]): Promise<ReviewInsights | null> {
  if (!client) return null;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content:
          'Summarize book reviews into JSON with loved, disliked, recurringThemes, and summary. Keep the language readable.'
      },
      { role: 'user', content: reviews.join('\n') }
    ]
  });

  const text = response.output_text ?? '';
  return text ? (JSON.parse(text) as ReviewInsights) : null;
}

export async function createEmbedding(input: string): Promise<number[] | null> {
  if (!client) return null;

  const result = await client.embeddings.create({ model: 'text-embedding-3-small', input });
  return result.data[0]?.embedding ?? null;
}
