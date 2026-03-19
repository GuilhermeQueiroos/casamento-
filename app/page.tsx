import Navbar from "@/components/Navbar";
import Countdown from "@/components/Countdown";
import Link from "next/link";

// 💡 FUTURO: buscar fotos do Supabase e exibir aqui dinamicamente
// Exemplo:
// const { data: fotos } = await supabase.from('fotos_home').select('*').limit(3)
// Cada foto tem: url, alt, posicao ('esquerda' | 'direita' | 'centro')

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-stone-200 rounded-full opacity-40" />
          <div className="absolute top-32 left-16 w-16 h-16 border border-stone-200 rounded-full opacity-30" />
          <div className="absolute bottom-32 right-10 w-48 h-48 border border-stone-200 rounded-full opacity-30" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-stone-200 rounded-full opacity-40" />
          <div className="absolute top-1/2 left-4 w-px h-32 bg-stone-200 opacity-40" />
          <div className="absolute top-1/2 right-4 w-px h-32 bg-stone-200 opacity-40" />
        </div>

        {/* 💡 FUTURO: foto de capa do casal aqui */}
        {/* <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-2 border-stone-200">
          <Image src={fotoCapaUrl} alt="Guilherme e Deborah" fill className="object-cover" />
        </div> */}

        <p className="font-lato text-xs tracking-[0.5em] uppercase text-stone-400 mb-8">
          Celebre conosco
        </p>

        <div className="relative mb-2">
          <h1 className="font-playfair text-7xl md:text-9xl text-stone-700 leading-none">
            Guilherme
          </h1>
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="h-px w-12 md:w-24 bg-stone-300" />
            <span className="font-playfair text-3xl md:text-4xl text-stone-400 italic">
              &
            </span>
            <div className="h-px w-12 md:w-24 bg-stone-300" />
          </div>
          <h1 className="font-playfair text-7xl md:text-9xl text-stone-700 leading-none">
            Deborah
          </h1>
        </div>

        <p className="font-lato text-stone-400 tracking-[0.3em] text-xs md:text-sm mt-6 mb-14">
          26 · JULHO · 2025 — GOIÂNIA, GO
        </p>

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

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-lato text-xs tracking-widest uppercase text-stone-400">
            Role
          </span>
          <div className="w-px h-8 bg-stone-400 animate-pulse" />
        </div>
      </section>

      {/* Divisor */}
      <div className="flex items-center justify-center gap-6 py-16 px-6">
        <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-stone-300" />
        <div className="flex gap-2 items-center">
          <div className="w-1 h-1 rounded-full bg-stone-400" />
          <span className="text-stone-400 text-lg">✦</span>
          <div className="w-1 h-1 rounded-full bg-stone-400" />
        </div>
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-stone-300" />
      </div>

      {/* 💡 FUTURO: galeria prévia de fotos do casal
      <section className="max-w-4xl mx-auto px-6 pb-16 grid grid-cols-3 gap-4">
        {fotos.map(foto => (
          <div key={foto.id} className="aspect-square overflow-hidden">
            <Image src={foto.url} alt={foto.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </section> */}

      {/* Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "O Evento",
            desc: "Data, horário, cerimônia e recepção",
            href: "/evento",
            num: "01",
          },
          {
            title: "Presentes",
            desc: "Presentes selecionados com carinho",
            href: "/presentes",
            num: "02",
          },
          {
            title: "Galeria",
            desc: "Momentos que guardaremos para sempre",
            href: "/galeria",
            num: "03",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative w-full text-center p-10 border border-stone-200 hover:border-stone-400 transition-all hover:shadow-sm"
          >
            <span className="font-lato text-xs text-stone-200 group-hover:text-stone-300 transition-colors absolute top-4 right-4">
              {card.num}
            </span>
            <h3 className="font-playfair text-2xl text-stone-700 mb-3 group-hover:text-stone-900 transition-colors">
              {card.title}
            </h3>
            <div className="w-8 h-px bg-stone-300 mx-auto mb-3 group-hover:w-16 transition-all duration-300" />
            <p className="font-lato text-sm text-stone-400 leading-relaxed">
              {card.desc}
            </p>
          </Link>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 text-center">
        <p className="font-lato text-xs text-stone-300 tracking-widest uppercase mb-2">
          Guilherme & Deborah · 2025
        </p>
        <Link
          href="/noivos"
          className="font-lato text-xs text-stone-200 hover:text-stone-400 tracking-widest uppercase transition-colors"
        >
          área dos noivos
        </Link>
      </footer>
    </>
  );
}
