// Issues signed upload tokens so the browser can send large video files straight
// to Vercel Blob. Video never passes through the serverless function (body limit ~4.5 MB).
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { adminGuard } from '@/lib/auth';

export async function POST(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  const body = (await request.json()) as HandleUploadBody;
  const json = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['video/*', 'audio/*', 'image/*'],
      maximumSizeInBytes: 10 * 1024 * 1024 * 1024,
      addRandomSuffix: true,
    }),
    onUploadCompleted: async () => {},
  });
  return Response.json(json);
}
