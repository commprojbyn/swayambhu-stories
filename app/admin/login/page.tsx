import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="container">
      <div className="login-card">
        <p className="eyebrow">Archive administration</p>
        <h2 style={{ marginBottom: 20 }}>Sign in</h2>
        <LoginForm />
      </div>
    </div>
  );
}
