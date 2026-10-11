'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { upload } from '@vercel/blob/client';
import { extractAudio } from '@/lib/extract-audio';
import { slugify } from '@/lib/format';
import { LANGUAGES } from '@/lib/types';

function videoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(v.duration || 0);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read this video file. Try an MP4 or MOV.'));
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
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get('video') as File | null;
    const title = String(f.get('title') ?? '').trim();
    if (!file || file.size === 0) return setError('Choose a video file.');
    if (!title) return setError('A title is required.');

    setBusy(true);
    setError(null);
    try {
      const stamp = Date.now().toString(36);
      const folder = `interviews/${slugify(title)}-${stamp}`;

      setStep('Reading video…');
      const duration = await videoDuration(file);

      setStep('Preparing audio for transcription (runs in your browser)…');
      const audio = await extractAudio(file, (p) => setStep(`Preparing audio… ${p}%`));

      setStep('Uploading video…');
      const videoBlob = await upload(`${folder}/video-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob',
        multipart: true,
      });

      setStep('Uploading audio…');
      const audioBlob = await upload(`${folder}/audio.mp3`, audio, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob',
        multipart: true,
        contentType: 'audio/mpeg',
      });

      setStep('Saving interview details…');
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
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.error ?? 'Could not save the interview');

      setStep('Transcribing and translating. Long interviews can take several minutes; keep this tab open.');
      // Processing may exceed a browser timeout; the detail page shows status and offers a retry.
      await fetch(`/api/admin/interviews/${created.id}/process`, { method: 'POST' }).catch(() => {});
      router.push(`/admin/interviews/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 820 }}>
      {error && <div className="error">{error}</div>}

      <div className="field">
        <label htmlFor="video">Interview video</label>
        <input className="input" id="video" name="video" type="file" accept="video/*" required disabled={busy} />
        <span className="small muted">MP4 or MOV recommended. The audio is extracted in your browser for transcription.</span>
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input className="input" id="title" name="title" required disabled={busy} placeholder="e.g. Dawn rituals at Swayambhu" />
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
        <input className="input" id="topics" name="topics" placeholder="rituals, prayer wheels, festivals" disabled={busy} />
      </div>

      <div className="field">
        <label htmlFor="summary">Summary</label>
        <textarea className="textarea" id="summary" name="summary" disabled={busy} placeholder="A short description shown on the interview page and used in search." />
      </div>

      <label className="checkbox" style={{ marginBottom: 20 }}>
        <input type="checkbox" name="published" defaultChecked disabled={busy} /> Publish on the public archive once transcribed
      </label>

      {busy && (
        <div className="notice">{step}</div>
      )}

      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Working…' : 'Upload and transcribe'}
      </button>
    </form>
  );
}
