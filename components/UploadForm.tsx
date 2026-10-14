'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { upload } from '@vercel/blob/client';
import { extractAudio } from '@/lib/extract-audio';
import { slugify } from '@/lib/format';
import { LANGUAGES } from '@/lib/types';

// Reads the video length. The preview link is removed only after the browser
// has finished with it, which avoids the ERR_FILE_NOT_FOUND message.
function videoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    const url = URL.createObjectURL(file);
    const cleanup = () => {
      v.removeAttribute('src');
      v.load();
      URL.revokeObjectURL(url);
    };
    v.preload = 'metadata';
    v.muted = true;
    v.onloadedmetadata = () => {
      const d = Number.isFinite(v.duration) ? v.duration : 0;
      cleanup();
      resolve(d);
    };
    v.onerror = () => {
      cleanup();
      reject(new Error('This browser cannot read the video. Try an MP4 (H.264) file.'));
    };
    v.src = url;
  });
}

export default function UploadForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const file = f.get('video') as File | null;
    const title = String(f.get('title') ?? '').trim();
    if (!file || file.size === 0) return setError('Choose a video file.');
    if (!title) return setError('A title is required.');

    setBusy(true);
    setError(null);

    // Remember the current stage so any error says where it happened.
    let stage = 'Starting';
    const mark = (s: string) => {
      stage = s;
      setStep(s);
    };

    try {
      const stamp = Date.now().toString(36);
      const folder = `interviews/${slugify(title)}-${stamp}`;

      mark('Reading video length');
      const duration = await videoDuration(file);

      mark('Preparing audio in your browser (this can take a while for long videos)');
      const audio = await extractAudio(file, (p) => mark(`Preparing audio… ${p}%`));

      mark('Uploading video');
      const videoBlob = await upload(`${folder}/video-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob',
        multipart: true,
      });

      mark('Uploading audio');
      const audioBlob = await upload(`${folder}/audio.mp3`, audio, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob',
        multipart: true,
        contentType: 'audio/mpeg',
      });

      mark('Saving interview details');
      const createRes = await fetch('/api/admin/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          interviewee: f.get('interviewee'),
          language: f.get('language'),
          recorded_on: f.get('recorded_on'),
          location: f.get('location'),
          summary: f.get('summary'),
          topics: f.get('topics'),
          published: f.get('published') === 'on',
          video_url: videoBlob.url,
          audio_url: audioBlob.url,
          duration_seconds: Math.round(duration),
        }),
      });
      const created = await createRes.json().catch(() => ({}));
      if (!createRes.ok) throw new Error(created.error ?? `Saving failed (HTTP ${createRes.status})`);

      mark('Transcribing and translating. Long interviews can take several minutes; keep this tab open.');
      // Processing can exceed the request time limit. The detail page shows the status and a retry button.
      await fetch(`/api/admin/interviews/${created.id}/process`, { method: 'POST' }).catch(() => {});
      router.push(`/admin/interviews/${created.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Stopped during "${stage}": ${msg}`);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 820 }}>
      {error && <div className="error">{error}</div>}

      <div className="field">
        <label htmlFor="video">Interview video</label>
        <input className="input" id="video" name="video" type="file" accept="video/*" required disabled={busy} />
        <span className="small muted">
          MP4 (H.264) recommended. Files over about 1.5 GB may be too large for the browser to prepare.
          The audio is extracted in your browser for transcription.
        </span>
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input className="input" id="title" name="title" required disabled={busy} placeholder="Interview title" />
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="interviewee">Interviewee</label>
          <input className="input" id="interviewee" name="interviewee" disabled={busy} />
        </div>
        <div className="field">
          <label htmlFor="language">Language spoken</label>
          <select className="select" id="language" name="language" defaultValue="Nepali" disabled={busy}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="recorded_on">Date recorded</label>
          <input className="input" id="recorded_on" name="recorded_on" type="date" disabled={busy} />
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input className="input" id="location" name="location" defaultValue="Swayambhu, Kathmandu" disabled={busy} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="topics">Topics (comma separated)</label>
        <input className="input" id="topics" name="topics" placeholder="topic one, topic two" disabled={busy} />
      </div>

      <div className="field">
        <label htmlFor="summary">Summary</label>
        <textarea className="textarea" id="summary" name="summary" disabled={busy} placeholder="A short description shown on the interview page." />
      </div>

      <label className="checkbox" style={{ marginBottom: 20 }}>
        <input type="checkbox" name="published" defaultChecked disabled={busy} /> Publish on the public archive once transcribed
      </label>

      {busy && <div className="notice">{step}</div>}

      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Working…' : 'Upload and transcribe'}
      </button>
    </form>
  );
}