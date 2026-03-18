import Navbar from "@/components/Navbar";
import Countdown from "@/components/Countdown";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-6">
          Celebre conosco
        </p>
        <h1 className="font-playfair text-6xl md:text-8xl text-stone-700 mb-4">
          Guilherme
          <span className="block text-3xl md:text-4xl text-stone-400 my-3">
            &
          </span>
          Deborah
        </h1>
        <p className="font-lato text-stone-400 tracking-widest text-sm mt-2 mb-12">
          26 · JULHO · 2025 — GOIÂNIA, GO
        </p>

        {/* Countdown */}
        <Countdown targetDate="2025-07-26T16:00:00" />

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link
            href="/rsvp"
            className="px-8 py-3 bg-stone-700 text-stone-50 text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Confirmar Presença
          </Link>
          <Link
            href="/evento"
            className="px-8 py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors"
          >
            Ver Detalhes
          </Link>
        </div>
      </section>

      {/* Divisor */}
      <div className="flex items-center justify-center gap-4 py-16">
        <div className="h-px w-24 bg-stone-300" />
        <span className="text-stone-300 text-xl">✦</span>
        <div className="h-px w-24 bg-stone-300" />
      </div>

      {/* Cards rápidos */}
      <section className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "O Evento",
            desc: "Data, horário, cerimônia e recepção",
            href: "/evento",
          },
          {
            title: "Lista de Presentes",
            desc: "Presentes selecionados com carinho",
            href: "/presentes",
          },
          {
            title: "Nossa Galeria",
            desc: "Momentos que guardaremos para sempre",
            href: "/galeria",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group text-center p-8 border border-stone-200 hover:border-stone-400 transition-colors"
          >
            <h3 className="font-playfair text-xl text-stone-700 mb-2 group-hover:text-stone-900 transition-colors">
              {card.title}
            </h3>
            <p className="font-lato text-sm text-stone-400">{card.desc}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
