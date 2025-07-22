export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white text-center py-4">
      &copy; {new Date().getFullYear()} <span className="font-semibold text-amber-200">The Gold Panicles</span>. All rights reserved.
    </footer>
  );
}
