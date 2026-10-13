import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="narrow" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <p className="eyebrow">Contact</p>
      <h1>Contact page title</h1>
      <p className="lead">Placeholder introduction for the contact page.</p>

      <h2 style={{ marginTop: 40, fontSize: '1.5rem' }}>Submit a story</h2>
      <ContactForm />

      <h2 style={{ marginTop: 48, fontSize: '1.5rem' }}>Other questions</h2>
      <p>
        Placeholder text for general questions. Contact details go here:{' '}
        <a href="mailto:email@example.org">email@example.org</a>.
      </p>
    </div>
  );
}