// Runs in the admin's browser. Converts the uploaded video to a small mono MP3
// so the transcription API (25 MB limit) can handle long interviews.
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

// The UMD build loads with a plain script, which avoids the module-loading
// error ("Cannot find module blob:...") that the ESM build can trigger.
const CORE_BASE = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg?.loaded) return ffmpeg;
  ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  return ffmpeg;
}

export async function extractAudio(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const ff = await getFFmpeg();

  const handler = ({ progress }: { progress: number }) =>
    onProgress?.(Math.min(100, Math.max(0, Math.round(progress * 100))));
  ff.on('progress', handler);

  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
  const input = `input.${ext}`;
  try {
    await ff.writeFile(input, await fetchFile(file));
    await ff.exec(['-i', input, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '32k', 'audio.mp3']);
    const data = (await ff.readFile('audio.mp3')) as Uint8Array;
    return new Blob([data as BlobPart], { type: 'audio/mpeg' });
  } finally {
    ff.off('progress', handler);
    await ff.deleteFile(input).catch(() => {});
    await ff.deleteFile('audio.mp3').catch(() => {});
  }
}