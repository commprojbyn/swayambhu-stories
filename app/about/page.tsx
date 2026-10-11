export default function AboutPage() {
  return (
    <div className="narrow" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <p className="eyebrow">About the archive</p>
      <h1>A living oral-history archive.</h1>
      <p className="lead">
        Swayambhu Stories gathers recorded interviews with people connected to Swayambhu. Each recording
        is accompanied by a timestamped transcript in its original language and an English translation, so that
        every passage can be searched, read and heard in context.
      </p>

      <h2 style={{ marginTop: 40 }}>How the transcripts are made</h2>
      <p>
        When an interview is added, its audio is transcribed automatically and the text is translated into English.
        The transcript is linked to the timestamps of the recording. Machine translations, especially of culturally
        specific terms, may be imperfect, and the original text is always shown alongside.
      </p>

      <h2 style={{ marginTop: 40 }} id="access">Access and consent</h2>
      <p>
        Interviews are shared with the consent of the people who took part. Speakers may ask for a recording or
        transcript to be removed or restricted at any time. Please do not reuse recordings without permission.
      </p>

      <h2 style={{ marginTop: 40 }} id="contact">Contact</h2>
      <p>To share a recording, correct a transcript, or ask about access, please write to the archive team at <a href="mailto:archive@example.org">archive@example.org</a>.</p>
    </div>
  );
}
