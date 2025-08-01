export default function Footer() {
  return (
    <>
      <hr className="border-black/20" />
      <footer className="bg-neutral-100 text-neutral-800 text-center py-4 text-sm opacity-80">
        &copy; {new Date().getFullYear()}{' '}
        <img
          src="/tgp.png"
          alt="TGP logo"
          className="h-5 inline align-text-bottom mr-1"
        />
        <span className="font-semibold text-yellow-300">The Gold Panicles</span>{' '}
        <br />
        <span className="block">
          The Official Student Publication of Caraga State University - Main
          Campus,
        </span>
        <span className="block">Ampayon Butuan City. All rights reserved.</span>
      </footer>
    </>
  );
}
