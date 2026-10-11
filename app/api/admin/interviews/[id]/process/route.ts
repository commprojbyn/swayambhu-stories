import { adminGuard } from '@/lib/auth';
import { processInterview } from '@/lib/pipeline';

// Transcribing an hour of audio plus translation can take minutes.
// 300s requires Vercel Pro (or Fluid compute); see README.
export const maxDuration = 300;
export const runtime = 'nodejs';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  try {
    const result = await processInterview(id);
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Processing failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
