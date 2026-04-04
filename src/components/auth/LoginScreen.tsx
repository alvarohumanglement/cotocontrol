import { useAuth } from '../../hooks/useAuth';
import { COMUNEROS } from '../../lib/constants';

export function LoginScreen() {
  const { selectProfile } = useAuth();

  return (
    <div
      className="flex items-center justify-center min-h-dvh px-6"
      style={{ background: 'var(--earth-900)' }}
    >
      <div className="w-full max-w-sm text-center">
        <h1
          className="text-3xl mb-1"
          style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}
        >
          CotoControl
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--earth-400)' }}>
          ¿Quién eres?
        </p>

        <div className="flex flex-col gap-3">
          {COMUNEROS.map((c) => (
            <button
              key={c.id}
              onClick={() => selectProfile(c.id)}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 cursor-pointer transition-colors"
              style={{
                background: 'var(--earth-800)',
                border: '1px solid var(--earth-600)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shrink-0"
                style={{ background: c.avatar_color, color: 'white' }}
              >
                {c.display_name[0]}
              </div>
              <span className="text-base font-medium" style={{ color: 'var(--earth-50)' }}>
                {c.display_name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
