import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const result = await signIn(email);
    setSending(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-dvh px-6"
      style={{ background: 'var(--earth-900)' }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <h1
          className="text-3xl mb-1"
          style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}
        >
          Huerta Comunitaria
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--earth-400)' }}>
          Gestión de bancales
        </p>

        {sent ? (
          /* Confirmation */
          <div className="rounded-lg p-6" style={{ background: 'var(--earth-800)' }}>
            <span className="text-4xl block mb-3">✉️</span>
            <p className="text-sm" style={{ color: 'var(--earth-200)' }}>
              Revisa tu email — te hemos enviado un enlace para entrar
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--earth-400)' }}>
              {email}
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="mt-4 text-xs border-none bg-transparent cursor-pointer"
              style={{ color: 'var(--green-200)' }}
            >
              Usar otro email
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-base mb-3 outline-none"
              style={{
                background: 'var(--earth-800)',
                border: '1px solid var(--earth-600)',
                color: 'var(--earth-50)',
                fontSize: '16px',
              }}
            />

            {error && (
              <p className="text-xs mb-3" style={{ color: 'var(--alert)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending || !email}
              className="w-full rounded-lg py-3 text-base font-medium border-none cursor-pointer transition-colors"
              style={{
                background: sending ? 'var(--earth-600)' : 'var(--green-600)',
                color: 'var(--earth-50)',
                opacity: sending || !email ? 0.7 : 1,
              }}
            >
              {sending ? 'Enviando...' : 'Entrar con magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
