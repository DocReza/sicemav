'use client';

import { Expediente } from '@/types';

function countByEstado(rows: Expediente[], estados: string[]) {
  return rows.filter((x) => estados.includes(x.estado)).length;
}

export default function Dashboard({ expedientes }: { expedientes: Expediente[] }) {
  const cardStyle: React.CSSProperties = {
    background: '#fff', border: '1px solid #dbe3ee', borderRadius: 16, padding: 16,
    boxShadow: '0 8px 24px rgba(22,40,66,.08)'
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div style={cardStyle}><div>Solicitudes</div><h2>{expedientes.length}</h2></div>
        <div style={cardStyle}><div>Procedentes</div><h2>{countByEstado(expedientes, ['Procedente', 'Facilitador asignado', 'Invitación 1 enviada', 'Invitación 2 enviada', 'Invitación 3 enviada', 'Audiencia inicial celebrada', 'En mediación/conciliación'])}</h2></div>
        <div style={cardStyle}><div>Acuerdos</div><h2>{countByEstado(expedientes, ['Acuerdo logrado', 'Formalización ante IMASC'])}</h2></div>
        <div style={cardStyle}><div>Arbitraje</div><h2>{countByEstado(expedientes, ['Arbitraje aceptado', 'En arbitraje', 'Laudo emitido'])}</h2></div>
      </div>
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Expedientes recientes</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#6b7a8c' }}>
                <th>Folio</th><th>Solicitante</th><th>Tipo</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((x) => (
                <tr key={x.id}>
                  <td>{x.folio}</td><td>{x.solicitante}</td><td>{x.tipo}</td><td>{x.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
