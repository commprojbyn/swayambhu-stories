'use client';
import { useState, type FormEvent } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: submissions are not stored or sent yet.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="notice">
        Thank you. This is a placeholder form, so your story has not been saved yet.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input className="input" id="name" name="name" placeholder="Name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input className="input" id="email" name="email" type="email" placeholder="you@example.com" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="relationship">Your connection to the place</label>
        <select className="select" id="relationship" name="relationship" defaultValue="">
          <option value="" disabled>Choose one</option>
          <option>Option one</option>
          <option>Option two</option>
          <option>Option three</option>
          <option>Other</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="story-title">Story title</label>
        <input className="input" id="story-title" name="story-title" placeholder="Give your story a title" />
      </div>

      <div className="field">
        <label htmlFor="story">Your story</label>
        <textarea
          className="textarea"
          id="story"
          name="story"
          style={{ minHeight: 180 }}
          placeholder="Placeholder prompt describing what kind of story to share."
        />
      </div>

      <div className="field">
        <label htmlFor="media">Audio or video (optional)</label>
        <input className="input" id="media" name="media" type="file" accept="audio/*,video/*" disabled />
        <span className="small muted">Uploads are not available yet.</span>
      </div>

      <label className="checkbox" style={{ marginBottom: 20 }}>
        <input type="checkbox" name="consent" /> Placeholder consent statement.
      </label>

      <button className="btn" type="submit">Submit your story</button>
    </form>
  );
}