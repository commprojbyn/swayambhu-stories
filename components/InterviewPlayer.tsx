'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SegmentRow } from '@/lib/types';
import { formatClock } from '@/lib/format';

type Mode = 'en' | 'orig' | 'both';

export default function InterviewPlayer({
  videoUrl,
  segments,
  initialSeconds,
}: {
  videoUrl: string | null;
  segments: SegmentRow[];
  initialSeconds?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<Mode>('en');
  const [query, setQuery] = useState('');

  // Index of the segment currently being spoken.
  const activeIdx = useMemo(() => {
    const ms = time * 1000;
    let found = -1;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].start_ms <= ms) found = i;
      else break;
    }
    return found;
  }, [time, segments]);

  // Deep link: /interviews/slug?t=125 starts at 2:05.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !initialSeconds) return;
    const onMeta = () => {
      v.currentTime = initialSeconds;
    };
    v.addEventListener('loadedmetadata', onMeta, { once: true });
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, [initialSeconds, videoUrl]);

  // Keep the active line visible in the transcript list.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIdx]);

  const q = query.trim().toLowerCase();
  const visible = q
    ? segments.filter((s) => (s.english ?? '').toLowerCase().includes(q) || s.original.toLowerCase().includes(q))
    : segments;

  function seek(ms: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = ms / 1000;
    v.play().catch(() => {});
  }

  const activeSeg = activeIdx >= 0 ? segments[activeIdx] : null;

  return (
    <div className="interview-layout">
      <div className="player-wrap">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            preload="metadata"
            playsInline
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onSeeked={(e) => setTime(e.currentTarget.currentTime)}
          />
        ) : (
          <div className="pending">
            The recording for this interview is not available yet. The transcript below
            will be linked to the video once it is uploaded.
          </div>
        )}
        {activeSeg && videoUrl && (
          <p className="small muted" style={{ marginTop: 12 }}>
            Now at {formatClock(activeSeg.start_ms)}
          </p>
        )}
      </div>

      <div className="transcript-panel">
        <div className="transcript-tools">
          <input
            className="input"
            placeholder="Find in transcript…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="seg-toggle" role="group" aria-label="Transcript language">
            {(['en', 'orig', 'both'] as Mode[]).map((m) => (
              <button key={m} type="button" className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
                {m === 'en' ? 'English' : m === 'orig' ? 'Original' : 'Both'}
              </button>
            ))}
          </div>
        </div>

        <div className="transcript" ref={listRef}>
          {segments.length === 0 && (
            <div className="transcript-empty">The transcript will appear here once it has been generated.</div>
          )}
          {segments.length > 0 && visible.length === 0 && (
            <div className="transcript-empty">No passages match “{query}”.</div>
          )}
          {visible.map((s) => {
            const isActive = activeSeg?.idx === s.idx;
            const en = s.english ?? s.original;
            return (
              <button
                key={s.idx}
                type="button"
                className={`seg${isActive ? ' active' : ''}`}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => seek(s.start_ms)}
                title="Play from here"
              >
                <span className="ts">{formatClock(s.start_ms)}</span>
                <span>
                  {(mode === 'en' || mode === 'both') && (
                    <span className="en">{en}</span>
                  )}
                  {(mode === 'orig' || (mode === 'both' && s.english)) && (
                    <span className="orig deva" lang="ne">{s.original}</span>
                  )}
                  {mode === 'en' && !s.english && <span className="orig">Original only</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
