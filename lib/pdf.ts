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

function normalizarTexto(valor?: string) {
  return valor && valor.trim() ? valor : '-';
}

function partirTexto(doc: jsPDF, texto?: string, ancho = 168) {
  return doc.splitTextToSize(normalizarTexto(texto), ancho);
}

async function cargarImagenComoDataURL(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generarAcusePDF(expediente: ExpedientePDF) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = 18;

  const azulOscuro = [17, 57, 95];
  const azulMedio = [31, 78, 121];
  const gris = [91, 101, 115];
  const grisClaro = [230, 235, 241];
  const negro = [20, 20, 20];
  const rojo = [163, 29, 42];

  // Fondo superior institucional
  doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Franja secundaria
  doc.setFillColor(azulMedio[0], azulMedio[1], azulMedio[2]);
  doc.rect(0, 30, pageWidth, 8, 'F');

  // Logo
  const logo = await cargarImagenComoDataURL('/logo-cemav.png');
  if (logo) {
    doc.addImage(logo, 'PNG', pageWidth - 38, 6, 20, 20);
  }

  // Encabezado
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SICEMAV', margin, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Conciliación y Expedientes', margin, 20);

  doc.setFontSize(10);
  doc.text('Centro de Mediación y Arbitraje Veterinario', margin, 25);

  y = 48;

  // Título
  doc.setTextColor(negro[0], negro[1], negro[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('ACUSE INSTITUCIONAL DE RECEPCIÓN DE SOLICITUD', margin, y);

  y += 10;

  // Folio destacado
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(210, 218, 226);
  doc.roundedRect(margin, y - 5, pageWidth - margin * 2, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(rojo[0], rojo[1], rojo[2]);
  doc.text(`FOLIO: ${normalizarTexto(expediente.folio)}`, margin + 4, y + 3);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(gris[0], gris[1], gris[2]);
  doc.text(`Fecha de emisión: ${formatearFecha(expediente.created_at)}`, pageWidth - 78, y + 3);

  y += 18;

  // Introducción
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(negro[0], negro[1], negro[2]);

  const intro = doc.splitTextToSize(
    'Por medio del presente se hace constar que SICEMAV recibió formalmente una solicitud para su registro y revisión administrativa inicial, conforme a los procedimientos internos aplicables.',
    172
  );
  doc.text(intro, margin, y);
  y += intro.length * 5 + 8;

  // Datos generales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(azulMedio[0], azulMedio[1], azulMedio[2]);
  doc.text('I. DATOS GENERALES DE LA SOLICITUD', margin, y);

  y += 6;
  doc.setDrawColor(grisClaro[0], grisClaro[1], grisClaro[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  const campo = (etiqueta: string, valor?: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.text(etiqueta, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(negro[0], negro[1], negro[2]);
    doc.text(normalizarTexto(valor), 72, y);

    y += 7;
  };

  campo('Solicitante:', expediente.solicitante);
  campo('Correo electrónico:', expediente.correo);
  campo('Teléfono:', expediente.telefono);
  campo('Contraparte:', expediente.contraparte);
  campo('Paciente / mascota:', expediente.paciente);
  campo('Tipo de asunto:', expediente.tipo);
  campo('Modalidad:', expediente.modalidad);
  campo('Estado inicial:', expediente.estado);

  y += 3;

  // Relato de hechos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(azulMedio[0], azulMedio[1], azulMedio[2]);
  doc.text('II. RELATO DE HECHOS ASENTADO POR LA PARTE SOLICITANTE', margin, y);

  y += 6;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  const relato = partirTexto(doc, expediente.hechos, 166);
  const relatoAltura = Math.max(34, relato.length * 5 + 10);

  doc.setFillColor(249, 250, 252);
  doc.setDrawColor(210, 218, 226);
  doc.roundedRect(margin, y, 172, relatoAltura, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(negro[0], negro[1], negro[2]);
  doc.text(relato, margin + 4, y + 7);

  y += relatoAltura + 10;

  // Validación de espacio
  if (y > pageHeight - 70) {
    doc.addPage();
    y = 20;
  }

  // Aviso institucional
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(azulMedio[0], azulMedio[1], azulMedio[2]);
  doc.text('III. ALCANCE DEL PRESENTE ACUSE', margin, y);

  y += 6;
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  const aviso = doc.splitTextToSize(
    'La presente constancia acredita exclusivamente la recepción y registro inicial de la solicitud en SICEMAV. Su expedición no implica pronunciamiento sobre procedencia, responsabilidad, fondo del asunto, ni resolución definitiva. El expediente podrá ser sujeto a revisión, prevención, requerimiento de información adicional, conciliación, arbitraje o cierre administrativo según corresponda.',
    170
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(negro[0], negro[1], negro[2]);
  doc.text(aviso, margin, y);

  y += aviso.length * 5 + 14;

  // Firmas
  doc.setDrawColor(160, 160, 160);
  doc.line(margin, y, 85, y);
  doc.line(122, y, 190, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(gris[0], gris[1], gris[2]);
  doc.text('Nombre y firma de recepción SICEMAV', margin, y);
  doc.text('Nombre y firma de la parte solicitante', 122, y);

  y += 14;

  // Pie
  doc.setDrawColor(grisClaro[0], grisClaro[1], grisClaro[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(gris[0], gris[1], gris[2]);

  const pie = doc.splitTextToSize(
    `Documento generado automáticamente por SICEMAV para fines de control y trazabilidad. Referencia interna: ${normalizarTexto(expediente.folio)}.`,
    170
  );
  doc.text(pie, margin, y);

  const nombre = expediente.folio
    ? `Acuse_Institucional_${expediente.folio}.pdf`
    : 'Acuse_Institucional_SICEMAV.pdf';

  doc.save(nombre);
}