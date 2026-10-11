export type InterviewRow = {
  id: string;
  slug: string;
  title: string;
  interviewee: string;
  language: string;
  recorded_on: string | null; // YYYY-MM-DD
  location: string;
  summary: string;
  topics: string[];
  published: boolean;
  status: 'awaiting_media' | 'uploaded' | 'processing' | 'ready' | 'error';
  error: string | null;
  duration_seconds: number | null;
  video_url: string | null;
  audio_url: string | null;
};

export type SegmentRow = {
  idx: number;
  start_ms: number;
  end_ms: number;
  original: string;
  english: string | null;
};

export const LANGUAGES = ['Nepali', 'Nepal Bhasa', 'English'] as const;
