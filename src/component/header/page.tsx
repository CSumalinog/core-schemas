// app/components/Header.tsx

export default function Header() {
  return (
    <header className="w-full bg-neutral-900 h-25">
      <nav className="flex justify-between items-center h-full px-6">
        <div className="relative h-[75%]">
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
  );
}
