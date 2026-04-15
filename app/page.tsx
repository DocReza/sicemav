'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import ExpedienteDetail from '@/components/ExpedienteDetail';
import ExpedientesTable from '@/components/ExpedientesTable';
import NewRequestForm from '@/components/NewRequestForm';
import UserBar from '@/components/UserBar';

export default function Page() {
  const [selectedExpedienteId, setSelectedExpedienteId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = '/login';
        return;
      }

      setCheckingAuth(false);
    }

    checkAuth();
  }, []);

  if (checkingAuth) {
    return <div style={{ padding: 24 }}>Verificando acceso...</div>;
  }

  return (
    <main
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: 24,
        display: 'grid',
        gap: 24,
      }}
    >
      <section>
        <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  }}
>
  <img
    src="/logo-sicemav.png"
    alt="SICEMAV"
    style={{
      height: 60,
      objectFit: 'contain',
    }}
  />

  <div>
    <h1 style={{ margin: 0 }}>SICEMAV v2</h1>
    <p style={{ margin: 0, color: '#6b7280' }}>
      Gestión de solicitudes y expedientes del CEMAV
    </p>
  </div>
</div>
      </section>

      <UserBar />

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #dbe3ee',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Nueva solicitud</h2>
          <NewRequestForm onSaved={() => setRefreshKey((prev) => prev + 1)} />
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #dbe3ee',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Bandeja de expedientes</h2>
          <ExpedientesTable
            onSelect={setSelectedExpedienteId}
            refreshKey={refreshKey}
          />
        </div>
      </section>

      <section
        style={{
          background: '#fff',
          border: '1px solid #dbe3ee',
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Detalle del expediente</h2>
        <ExpedienteDetail expedienteId={selectedExpedienteId} />
      </section>
    </main>
  );
}