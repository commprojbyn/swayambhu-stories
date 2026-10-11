'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { InterviewRow } from '@/lib/types';
import { LANGUAGES } from '@/lib/types';

export default function EditForm({ iv }: { iv: InterviewRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy('save');
    setMsg(null);
    const res = await fetch(`/api/admin/interviews/${iv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: f.get('title'),
        interviewee: f.get('interviewee'),
        language: f.get('language'),
        recorded_on: f.get('recorded_on') || null,
        location: f.get('location'),
        summary: f.get('summary'),
        topics: f.get('topics'),
        published: f.get('published') === 'on',
      }),
    });
    setBusy(null);
    if (res.ok) {
      setMsg({ kind: 'ok', text: 'Saved.' });
      router.refresh();
    } else {
      setMsg({ kind: 'error', text: (await res.json()).error ?? 'Could not save' });
    }
  }

  async function reprocess() {
    setBusy('process');
    setMsg({ kind: 'ok', text: 'Transcribing and translating… this can take several minutes.' });
    const res = await fetch(`/api/admin/interviews/${iv.id}/process`, { method: 'POST' });
    setBusy(null);
    const body = await res.json().catch(() => ({}));
    if (res.ok) setMsg({ kind: 'ok', text: `Transcript ready: ${body.segments} passages.` });
    else setMsg({ kind: 'error', text: body.error ?? 'Processing failed' });
    router.refresh();
  }

  async function remove() {
    if (!confirm('Delete this interview and its transcript? This cannot be undone.')) return;
    setBusy('delete');
    const res = await fetch(`/api/admin/interviews/${iv.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin');
    else { setBusy(null); setMsg({ kind: 'error', text: 'Could not delete' }); }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'start' }}>
      <form onSubmit={save}>
        {msg && <div className={msg.kind === 'error' ? 'error' : 'notice'}>{msg.text}</div>}
        <div className="field"><label htmlFor="title">Title</label><input className="input" id="title" name="title" defaultValue={iv.title} required /></div>
        <div className="grid-2">
          <div className="field"><label htmlFor="interviewee">Interviewee</label><input className="input" id="interviewee" name="interviewee" defaultValue={iv.interviewee} /></div>
          <div className="field"><label htmlFor="language">Language</label>
            <select className="select" id="language" name="language" defaultValue={iv.language}>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="recorded_on">Date recorded</label><input className="input" id="recorded_on" name="recorded_on" type="date" defaultValue={iv.recorded_on ?? ''} /></div>
          <div className="field"><label htmlFor="location">Location</label><input className="input" id="location" name="location" defaultValue={iv.location} /></div>
        </div>
        <div className="field"><label htmlFor="topics">Topics (comma separated)</label><input className="input" id="topics" name="topics" defaultValue={iv.topics.join(', ')} /></div>
        <div className="field"><label htmlFor="summary">Summary</label><textarea className="textarea" id="summary" name="summary" defaultValue={iv.summary} /></div>
        <label className="checkbox" style={{ marginBottom: 20 }}>
          <input type="checkbox" name="published" defaultChecked={iv.published} /> Published on the public archive
        </label>
        <div className="actions">
          <button className="btn" type="submit" disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save details'}</button>
        </div>
      </form>

      <aside className="list" style={{ padding: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 6 }}>Transcript</p>
        <p className="small muted">
          Status: <span className={`badge ${iv.status}`}>{iv.status.replace('_', ' ')}</span>
        </p>
        {iv.error && <div className="error">{iv.error}</div>}
        <p className="small muted">
          Processing extracts the transcript, translates it to English, and creates search embeddings.
          Re-running replaces the existing transcript.
        </p>
        <div className="actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <button className="btn" type="button" onClick={reprocess} disabled={!!busy || !iv.audio_url}>
            {busy === 'process' ? 'Processing…' : iv.status === 'ready' ? 'Re-run transcription' : 'Run transcription'}
          </button>
          {iv.video_url && <a className="btn btn-ghost" href={iv.video_url} target="_blank" rel="noreferrer">Open video file</a>}
          <a className="btn btn-ghost" href={`/interviews/${iv.slug}`} target="_blank" rel="noreferrer">View public page</a>
          <button className="btn btn-danger" type="button" onClick={remove} disabled={!!busy}>Delete interview</button>
        </div>
      </aside>
    </div>
  );
}
