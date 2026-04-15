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
};

export function generarAcusePDF(expediente: ExpedientePDF) {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SICEMAV - CEMAV', 20, 20);

  doc.setFontSize(12);
  doc.text('Acuse de recepción de solicitud', 20, 30);

  doc.setDrawColor(180);
  doc.line(20, 35, 190, 35);

  let y = 45;

  const linea = (etiqueta: string, valor?: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${etiqueta}:`, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(valor && valor.trim() ? valor : '-', 75, y);
    y += 10;
  };

  linea('Folio', expediente.folio);
  linea('Solicitante', expediente.solicitante);
  linea('Correo', expediente.correo);
  linea('Teléfono', expediente.telefono);
  linea('Contraparte', expediente.contraparte);
  linea('Paciente / mascota', expediente.paciente);
  linea('Tipo', expediente.tipo);
  linea('Modalidad', expediente.modalidad);
  linea('Estado', expediente.estado);

  doc.setFont('helvetica', 'bold');
  doc.text('Relato de hechos:', 20, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  const texto = doc.splitTextToSize(
    expediente.hechos && expediente.hechos.trim() ? expediente.hechos : '-',
    170
  );
  doc.text(texto, 20, y);
  y += texto.length * 6 + 10;

  doc.setDrawColor(180);
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  doc.text('Documento generado automáticamente por SICEMAV.', 20, y);

  const nombre = expediente.folio
    ? `Acuse_${expediente.folio}.pdf`
    : 'Acuse_SICEMAV.pdf';

  doc.save(nombre);
}