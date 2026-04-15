'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    window.location.href = '/';
  }

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: 420,
        margin: '60px auto',
        padding: 24,
        border: '1px solid #dbe3ee',
        borderRadius: 16,
        background: '#fff',
        display: 'grid',
        gap: 12,
      }}
    >
      <h1 style={{ margin: 0 }}>Acceso SICEMAV</h1>
      <p style={{ marginTop: 0, color: '#64748b' }}>
        Inicia sesión para entrar al sistema.
      </p>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          border: 'none',
          background: '#1f5fa8',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {!!message && (
        <div style={{ fontSize: 14, color: '#334155' }}>{message}</div>
      )}
    </form>
  );
}