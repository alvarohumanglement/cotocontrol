import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { supabase } from '../lib/supabase';

const AVATAR_COLORS = [
  { name: 'Verde', value: 'var(--green-400)', hex: '#5A9A22' },
  { name: 'Naranja', value: 'var(--orange-400)', hex: '#E07B1A' },
  { name: 'Morado', value: 'var(--purple-400)', hex: '#8060CC' },
  { name: 'Tierra', value: 'var(--earth-400)', hex: '#8A7E6E' },
  { name: 'Agua', value: 'var(--water)', hex: '#4AA3CC' },
  { name: 'Rojo', value: 'var(--alert)', hex: '#D64545' },
];

export function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const { bancales } = useBancales();
  const { plantings } = usePlantings();
  const { logs } = useActivityLogs();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarColor, setAvatarColor] = useState(profile?.avatar_color ?? '#5A9A22');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setAvatarColor(profile.avatar_color);
    }
  }, [profile]);

  const activePlantings = plantings.filter((p) => p.status === 'active').length;

  const handleSave = async () => {
    if (!supabase || !user) return;
    setSaving(true);
    setError('');
    setSaved(false);
    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: displayName, avatar_color: avatarColor })
      .eq('id', user.id);
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="p-4 pb-8">
      <h2 className="text-2xl mb-6 mt-0" style={{ color: 'var(--earth-50)' }}>Ajustes</h2>

      {/* Profile section */}
      <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
        <h3 className="text-sm font-semibold mt-0 mb-3" style={{ color: 'var(--earth-400)' }}>Perfil</h3>

        <div className="mb-3">
          <label className="text-xs font-medium block mb-1" style={{ color: 'var(--earth-200)' }}>Nombre</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-lg px-3 py-2.5 outline-none text-base"
            style={{
              background: 'var(--earth-900)',
              border: '1px solid var(--earth-600)',
              color: 'var(--earth-50)',
              fontSize: '16px',
            }}
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium block mb-2" style={{ color: 'var(--earth-200)' }}>Color de avatar</label>
          <div className="flex gap-3">
            {AVATAR_COLORS.map((c) => (
              <button key={c.hex} onClick={() => setAvatarColor(c.hex)}
                className="w-9 h-9 rounded-full cursor-pointer border-2 transition-all"
                style={{
                  background: c.hex,
                  borderColor: avatarColor === c.hex ? 'var(--earth-50)' : 'transparent',
                  transform: avatarColor === c.hex ? 'scale(1.15)' : 'scale(1)',
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-xs mb-2" style={{ color: 'var(--alert)' }}>{error}</p>}
        {saved && <p className="text-xs mb-2" style={{ color: 'var(--green-200)' }}>Guardado correctamente</p>}

        <button onClick={handleSave} disabled={saving}
          className="w-full py-2.5 rounded-lg text-sm font-medium border-none cursor-pointer"
          style={{ background: saving ? 'var(--earth-600)' : 'var(--green-600)', color: 'var(--earth-50)', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Huerta stats */}
      <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
        <h3 className="text-sm font-semibold mt-0 mb-3" style={{ color: 'var(--earth-400)' }}>La huerta</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-semibold m-0" style={{ color: 'var(--earth-50)', fontFamily: "'IBM Plex Mono', monospace" }}>
              {bancales.length}
            </p>
            <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>bancales</p>
          </div>
          <div>
            <p className="text-xl font-semibold m-0" style={{ color: 'var(--green-200)', fontFamily: "'IBM Plex Mono', monospace" }}>
              {activePlantings}
            </p>
            <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>plantaciones</p>
          </div>
          <div>
            <p className="text-xl font-semibold m-0" style={{ color: 'var(--water)', fontFamily: "'IBM Plex Mono', monospace" }}>
              {logs.length}
            </p>
            <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>registros</p>
          </div>
        </div>
      </div>

      {/* Email info */}
      <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
        <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>Conectado como</p>
        <p className="text-sm m-0 mt-1" style={{ color: 'var(--earth-50)', fontFamily: "'IBM Plex Mono', monospace" }}>
          {user?.email ?? '—'}
        </p>
      </div>

      {/* Logout */}
      <button onClick={signOut}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer"
        style={{ background: 'transparent', border: '1px solid var(--alert)', color: 'var(--alert)' }}>
        Cerrar sesión
      </button>

      {/* Version */}
      <p className="text-center text-xs mt-6" style={{ color: 'var(--earth-600)' }}>
        Huerta Tracker v0.2
      </p>
    </div>
  );
}
