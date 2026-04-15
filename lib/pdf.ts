import jsPDF from 'jspdf';

type ExpedientePDF = {
  folio?: string;
  solicitante?: string;
  correo?: string;
  telefono?: string;
  contraparte?: string;
  paciente?: string;
  tipo?: string;
  modalidad?: string;
  estado?: string;
  hechos?: string;
  created_at?: string;
};

function formatearFecha(fecha?: string) {
  const base = fecha ? new Date(fecha) : new Date();
  return base.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function partirTexto(doc: jsPDF, texto: string, ancho = 170) {
  return doc.splitTextToSize(texto && texto.trim() ? texto : '-', ancho);
}

export function generarAcusePDF(expediente: ExpedientePDF) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const azul = '#1f4e79';
  const gris = '#5b6573';
  const negro = '#111111';

  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SICEMAV', margin, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Conciliación y Expedientes', margin, 20);

  y = 34;

  doc.setTextColor(17, 17, 17);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('ACUSE DE RECEPCIÓN DE SOLICITUD', margin, y);

  y += 8;
  doc.setDrawColor(31, 78, 121);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(91, 101, 115);
  doc.text(`Fecha de emisión: ${formatearFecha(expediente.created_at)}`, margin, y);

  y += 10;

  const campo = (etiqueta: string, valor?: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 78, 121);
    doc.text(etiqueta, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 17, 17);
    doc.text(valor && valor.trim() ? valor : '-', 72, y);
    y += 8;
  };

  campo('Folio:', expediente.folio);
  campo('Solicitante:', expediente.solicitante);
  campo('Correo electrónico:', expediente.correo);
  campo('Teléfono:', expediente.telefono);
  campo('Contraparte:', expediente.contraparte);
  campo('Paciente / mascota:', expediente.paciente);
  campo('Tipo de inconformidad:', expediente.tipo);
  campo('Modalidad solicitada:', expediente.modalidad);
  campo('Estado inicial:', expediente.estado);

  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 78, 121);
  doc.text('Relato de hechos:', margin, y);

  y += 6;
  doc.setDrawColor(220, 227, 238);
  doc.setFillColor(248, 250, 252);
  const relatoTexto = partirTexto(doc, expediente.hechos || '-', 168);
  const relatoAltura = Math.max(28, relatoTexto.length * 5 + 8);
  doc.roundedRect(margin, y, 170, relatoAltura, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 17, 17);
  doc.text(relatoTexto, margin + 4, y + 7);

  y += relatoAltura + 10;

  const aviso = [
    'La presente constancia acredita únicamente la recepción de la solicitud en el sistema SICEMAV.',
    'Su emisión no prejuzga sobre la procedencia, responsabilidad, fondo del asunto o resolución final.',
    'El expediente podrá ser objeto de revisión, requerimientos adicionales y canalización conforme a las reglas aplicables.'
  ];

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 78, 121);
  doc.text('Observaciones institucionales:', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 17, 17);
  const avisoTexto = doc.splitTextToSize(aviso.join(' '), 170);
  doc.text(avisoTexto, margin, y);

  y += avisoTexto.length * 5 + 14;

  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y, 85, y);
  doc.line(120, y, 190, y);

  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(91, 101, 115);
  doc.text('Nombre y firma de quien recibe', margin, y);
  doc.text('Nombre y firma del solicitante', 120, y);

  y += 16;

  doc.setDrawColor(220, 227, 238);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(91, 101, 115);
  const pie = `Documento generado automáticamente por SICEMAV. Folio de referencia: ${expediente.folio || '-'}.`;
  doc.text(doc.splitTextToSize(pie, 170), margin, y);

  const nombre = expediente.folio
    ? `Acuse_Formal_${expediente.folio}.pdf`
    : 'Acuse_Formal_SICEMAV.pdf';

  doc.save(nombre);
}