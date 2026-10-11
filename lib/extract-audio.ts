// Runs in the admin's browser. Converts the uploaded video to a small mono MP3
// so the transcription API (25 MB limit) can handle hour-long interviews.
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function extractAudio(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }
  const ff = ffmpeg;
  const handler = ({ progress }: { progress: number }) =>
    onProgress?.(Math.min(100, Math.round(progress * 100)));
  ff.on('progress', handler);

  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
  const input = `input.${ext}`;
  try {
    await ff.writeFile(input, await fetchFile(file));
    await ff.exec(['-i', input, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '32k', 'audio.mp3']);
    const data = (await ff.readFile('audio.mp3')) as Uint8Array;
    return new Blob([data as BlobPart], { type: "audio/mpeg" });
  } finally {
    ff.off('progress', handler);
    await ff.deleteFile(input).catch(() => {});
    await ff.deleteFile('audio.mp3').catch(() => {});
  }
}
