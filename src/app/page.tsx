import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>We never flinched in serving you the truth</h1>
        <Link href="/login">
          <button className="button">Get Started</button>
        </Link>
      </section>
    </main>
  );
}
