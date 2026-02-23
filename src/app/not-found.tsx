import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-[1120px]">
        <div className="rounded-3xl bg-white/60 px-6 py-14 sm:px-10 sm:py-16 ring-1 ring-[#d9d9d9] shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
            404
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1f1f1f]">
            Page not found
          </h1>
          <p className="mt-3 text-[#1f1f1f]/70">
            The page you’re looking for doesn’t exist.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="pill">
              HOME
            </Link>
            <Link href="/menu" className="pill pill-primary">
              VIEW MENU
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}