import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'SICEMAV',
  description: 'Sistema Integral del CEMAV',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f4f7fb', color: '#17324d' }}>
        {children}
      </body>
    </html>
  );
}
