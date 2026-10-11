import UploadForm from '@/components/UploadForm';

export default function NewInterviewPage() {
  return (
    <>
      <p className="eyebrow">New interview</p>
      <h1 style={{ fontSize: '2.2rem' }}>Upload an interview</h1>
      <p className="muted" style={{ marginBottom: 28 }}>
        The video is stored, the audio is transcribed automatically, and each passage is translated into English
        and linked to its timestamp.
      </p>
      <UploadForm />
    </>
  );
}
