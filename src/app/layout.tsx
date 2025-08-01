import './globals.css';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        
        <main className="flex-1">{children}</main>
        
      </body>
    </html>
  );
}
