export type ExpedienteEstado =
  | 'Solicitud recibida'
  | 'En revisión'
  | 'Procedente'
  | 'En conciliación'
  | 'Sin acuerdo'
  | 'En arbitraje'
  | 'Concluido';

export type Expediente = {
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
  estado: ExpedienteEstado;
  mecanismo?: string | null;
  facilitador?: string | null;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
};
