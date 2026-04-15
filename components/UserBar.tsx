'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
  full_name?: string | null;
  email?: string | null;
  role: string;
};

export default function UserBar() {
  const [profile, setProfile] = useState<Profile | null>(null);

  async function loadProfile() {
    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        border: '1px solid #dbe3ee',
        borderRadius: 12,
        background: '#fff',
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>
          {profile?.full_name || 'Usuario'}
        </div>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          {profile?.email || ''} · Rol: {profile?.role || 'sin rol'}
        </div>
      </div>

      <button
        onClick={signOut}
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: 'none',
          background: '#dc2626',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}