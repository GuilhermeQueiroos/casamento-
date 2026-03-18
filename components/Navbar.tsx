"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/historia", label: "Nossa História" },
  { href: "/evento", label: "Evento" },
  { href: "/galeria", label: "Galeria" },
  { href: "/presentes", label: "Presentes" },
  { href: "/rsvp", label: "Confirmar" },
  { href: "/noivos", label: "♥ Noivos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-playfair text-xl text-stone-700 tracking-wide"
        >
          G & D
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-lato text-sm text-stone-500 hover:text-stone-800 transition-colors tracking-widest uppercase"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-stone-600"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-stone-600 transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-stone-600 transition-all ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-stone-600 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200 px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-stone-500 hover:text-stone-800 tracking-widest uppercase"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
