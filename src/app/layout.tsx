import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full bg-white h-20 ">
          <nav className="flex justify-between items-center h-full px-6">
            <div className="relative h-[80%]">
              {/* Desktop logo */}
              <img
                src="/tgp.png"
                alt="Tgp Logo"
                className="h-full hidden md:block"
              />
              {/* Mobile logo */}
              <img
                src="/tgp.png"
                alt="Tgp Logo"
                className="h-full block md:hidden"
              />
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          The Gold Panicles
        </footer>
      </body>
    </html>
  );
}
