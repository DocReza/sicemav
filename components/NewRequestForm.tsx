'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpedienteEstado } from '@/types';

const initialState = {
  solicitante: '',
  correo: '',
  telefono: '',
  contraparte: '',
  paciente: '',
  tipo: 'Inconformidad por cirugía',
  modalidad: 'Virtual',
  hechos: '',
};

export default function NewRequestForm({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  async function loadRole() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setRole(null);
      setLoadingRole(false);
      return;
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    setRole(data?.role ?? null);
    setLoadingRole(false);
  }

  useEffect(() => {
    loadRole();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!role || !['admin', 'recepcion'].includes(role)) {
      setMessage('No tienes permiso para crear solicitudes.');
      return;
    }

    setSaving(true);
    setMessage('');

    const folio = `CEMAV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const estado: ExpedienteEstado = 'Solicitud recibida';

    const { error } = await supabase.from('expedientes').insert({
      folio,
      ...form,
      estado,
      mecanismo: 'Pendiente',
      facilitador: null,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(`Solicitud guardada con folio ${folio}`);
      setForm(initialState);
      onSaved?.();
    }

    setSaving(false);
  }

  if (loadingRole) {
    return <div>Cargando permisos...</div>;
  }

  if (!role || !['admin', 'recepcion'].includes(role)) {
    return (
      <div style={{ color: '#64748b' }}>
        No tienes permiso para crear solicitudes con este usuario.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      <input
        placeholder="Nombre del solicitante"
        value={form.solicitante}
        onChange={(e) => setForm({ ...form, solicitante: e.target.value })}
      />

      <input
        placeholder="Correo"
        type="email"
        value={form.correo}
        onChange={(e) => setForm({ ...form, correo: e.target.value })}
      />

      <input
        placeholder="Teléfono"
        value={form.telefono}
        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
      />

      <input
        placeholder="Contraparte"
        value={form.contraparte}
        onChange={(e) => setForm({ ...form, contraparte: e.target.value })}
      />

      <input
        placeholder="Paciente / mascota"
        value={form.paciente}
        onChange={(e) => setForm({ ...form, paciente: e.target.value })}
      />

      <select
        value={form.tipo}
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
      >
        <option>Inconformidad por cirugía</option>
        <option>Costos hospitalarios</option>
        <option>Fallecimiento del paciente</option>
        <option>Negligencia percibida</option>
        <option>Hospitalización</option>
        <option>Otro</option>
      </select>

      <select
        value={form.modalidad}
        onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
      >
        <option>Virtual</option>
        <option>Presencial</option>
      </select>

      <textarea
        placeholder="Relato de hechos"
        value={form.hechos}
        onChange={(e) => setForm({ ...form, hechos: e.target.value })}
        rows={4}
      />

      <button
        type="submit"
        disabled={saving}
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          border: 'none',
          background: '#3b82f6',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {saving ? 'Guardando...' : 'Guardar solicitud'}
      </button>

      {!!message && (
        <div style={{ fontSize: 14, color: '#334155' }}>
          {message}
        </div>
      )}
    </form>
  );
}