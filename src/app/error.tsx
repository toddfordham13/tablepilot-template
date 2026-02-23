"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-[1120px]">
        <div className="rounded-3xl bg-white/60 px-6 py-14 sm:px-10 sm:py-16 ring-1 ring-[#d9d9d9] shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
            Something went wrong
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1f1f1f]">
            We hit an error
          </h1>
          <p className="mt-3 text-[#1f1f1f]/70">
            Try again, or head back home.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => reset()} className="pill pill-primary">
              TRY AGAIN
            </button>
            <Link href="/" className="pill">
              HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}