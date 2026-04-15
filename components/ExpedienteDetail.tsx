'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Expediente = {
  id: string;
  folio: string;
  solicitante: string;
  correo?: string;
  telefono?: string;
  contraparte: string;
  paciente?: string;
  tipo: string;
  modalidad?: string;
  hechos?: string;
  estado: string;
  notas?: string;
  created_at?: string;
  updated_at?: string;
};

const ESTADOS = [
  'Solicitud recibida',
  'En revisión',
  'Procedente',
  'En conciliación',
  'Sin acuerdo',
  'En arbitraje',
  'Concluido',
];

export default function ExpedienteDetail({
  expedienteId,
}: {
  expedienteId: string | null;
}) {
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState('');
  const [role, setRole] = useState<string | null>(null);

  const canEdit = ['admin', 'facilitador', 'arbitro'].includes(role || '');

  async function loadRole() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    setRole(data?.role ?? null);
  }

  async function fetchExpediente() {
    if (!expedienteId) {
      setExpediente(null);
      setNotas('');
      setEstado('');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('expedientes')
      .select('*')
      .eq('id', expedienteId)
      .single();

    if (error) {
      console.error('Error cargando expediente:', error.message);
      setExpediente(null);
    } else {
      const exp = data as Expediente;
      setExpediente(exp);
      setNotas(exp.notas ?? '');
      setEstado(exp.estado ?? 'Solicitud recibida');
    }

    setLoading(false);
  }

  async function saveChanges() {
    if (!expedienteId) return;

    if (!canEdit) {
      alert('No tienes permiso para editar expedientes.');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('expedientes')
      .update({
        estado,
        notas,
      })
      .eq('id', expedienteId);

    if (error) {
      alert(`Error guardando cambios: ${error.message}`);
    } else {
      await fetchExpediente();
      alert('Expediente actualizado');
    }

    setSaving(false);
  }

  useEffect(() => {
    loadRole();
  }, []);

  useEffect(() => {
    fetchExpediente();
  }, [expedienteId]);

  if (!expedienteId) {
    return <div>Selecciona un expediente para verlo.</div>;
  }

  if (loading) {
    return <div>Cargando expediente...</div>;
  }

  if (!expediente) {
    return <div>No se encontró el expediente.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h3 style={{ margin: 0 }}>{expediente.folio}</h3>
        <p style={{ color: '#6b7a8c', marginTop: 4 }}>
          Última actualización: {expediente.updated_at ?? expediente.created_at ?? 'N/D'}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>Solicitante:</strong> {expediente.solicitante}</div>
        <div><strong>Correo:</strong> {expediente.correo || 'N/D'}</div>
        <div><strong>Teléfono:</strong> {expediente.telefono || 'N/D'}</div>
        <div><strong>Contraparte:</strong> {expediente.contraparte}</div>
        <div><strong>Paciente:</strong> {expediente.paciente || 'N/D'}</div>
        <div><strong>Tipo:</strong> {expediente.tipo}</div>
        <div><strong>Modalidad:</strong> {expediente.modalidad || 'N/D'}</div>
        <div><strong>Hechos:</strong> {expediente.hechos || 'N/D'}</div>
        <div><strong>Rol actual:</strong> {role || 'sin rol'}</div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          Estado
        </label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          disabled={!canEdit}
          style={{ width: '100%', padding: 10, borderRadius: 8 }}
        >
          {ESTADOS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          Notas del caso
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={8}
          disabled={!canEdit}
          style={{ width: '100%', padding: 10, borderRadius: 8 }}
        />
      </div>

      <div>
        {canEdit ? (
          <button
            onClick={saveChanges}
            disabled={saving}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#1f5fa8',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        ) : (
          <div style={{ color: '#64748b' }}>
            No tienes permiso para editar este expediente.
          </div>
        )}
      </div>
    </div>
  );
}