import OpenAI from 'openai';

let client: OpenAI | null = null;
export function getOpenAI(): OpenAI {
  if (!client) client = new OpenAI(); // reads OPENAI_API_KEY
  return client;
}

// 256 dimensions keeps the vector column small while retaining good quality.
export async function embedTexts(texts: string[]): Promise<(number[] | null)[]> {
  if (!process.env.OPENAI_API_KEY) return texts.map(() => null);
  const openai = getOpenAI();
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 200) {
    const res = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      dimensions: 256,
      input: texts.slice(i, i + 200),
    });
    out.push(...res.data.map((d) => d.embedding));
  }
  return out;
}

export async function embedQuery(q: string): Promise<number[] | null> {
  const [v] = await embedTexts([q]);
  return v ?? null;
}

export const toVector = (v: number[]) => `[${v.join(',')}]`;
