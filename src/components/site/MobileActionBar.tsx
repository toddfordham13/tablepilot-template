"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export default function MobileActionBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Always route to home anchors so it works from /menu and /gallery too
  const directionsHref = useMemo(() => "/#find", []);
  const privateHireHref = useMemo(() => "/#private-hire", []);

  useEffect(() => {
    const onScroll = () => {
      // Show after a small scroll so it doesn’t cover hero CTAs immediately
      setShow(window.scrollY > 140);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on pages where it would be annoying? (optional)
  // For now we keep it everywhere because it’s core actions.
  // If you later want it only on /, we can restrict it.

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-50 md:hidden",
        "px-4 pb-4",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        "transition duration-300",
      ].join(" ")}
      aria-hidden={!show}
    >
      <div className="mx-auto w-full max-w-[520px] rounded-2xl border border-black/10 bg-white/75 backdrop-blur shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3 p-3">
          <Link
            href={directionsHref}
            className="pill flex-1 justify-center text-center"
            aria-label="Get directions to Graze Lounge"
          >
            DIRECTIONS
          </Link>

          <Link
            href={privateHireHref}
            className="pill pill-primary flex-1 justify-center text-center"
            aria-label="Private hire enquiry"
          >
            PRIVATE HIRE
          </Link>
        </div>
      </div>
    </div>
  );
}