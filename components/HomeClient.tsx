"use client";

import Countdown from "@/components/Countdown";
import Link from "next/link";

export default function HomeClient() {
  return (
    <>
      <Countdown targetDate="2025-07-26T16:00:00" />
      <div className="flex flex-row gap-3 mt-12 mx-auto">
        <Link
          href="/rsvp"
          className="text-center px-8 py-3 bg-stone-700 text-stone-50 text-xs tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors whitespace-nowrap"
        >
          Confirmar Presença
        </Link>
        <Link
          href="/evento"
          className="text-center px-8 py-3 border border-stone-300 text-stone-600 text-xs tracking-[0.2em] uppercase hover:border-stone-500 hover:text-stone-800 transition-colors whitespace-nowrap"
        >
          Ver Detalhes
        </Link>
      </div>
    </>
  );
}
