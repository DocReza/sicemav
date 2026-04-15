'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { generarAcusePDF } from '@/lib/pdf';

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
  estado: string;
  hechos?: string;
};

export default function ExpedientesTable({
  onSelect,
  refreshKey,
}: {
  onSelect: (id: string) => void;
  refreshKey: number;
}) {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchExpedientes() {
    setLoading(true);

    const { data, error } = await supabase
      .from('expedientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando expedientes:', error.message);
      setExpedientes([]);
    } else {
      setExpedientes((data as Expediente[]) ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchExpedientes();
  }, [refreshKey]);

  if (loading) {
    return <div>Cargando expedientes...</div>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 8 }}>Folio</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Solicitante</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Contraparte</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Tipo</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {expedientes.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: 8 }}>
              Sin expedientes aún
            </td>
          </tr>
        ) : (
          expedientes.map((exp) => (
            <tr key={exp.id}>
              <td style={{ padding: 8 }}>{exp.folio}</td>
              <td style={{ padding: 8 }}>{exp.solicitante}</td>
              <td style={{ padding: 8 }}>{exp.contraparte}</td>
              <td style={{ padding: 8 }}>{exp.tipo}</td>
              <td style={{ padding: 8 }}>{exp.estado}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onSelect(exp.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#1f5fa8',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Ver
                </button>

                <button
                  onClick={() => generarAcusePDF(exp)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  PDF
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}