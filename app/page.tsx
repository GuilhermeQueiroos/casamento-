"use client";

import Navbar from "@/components/Navbar";
import Countdown from "@/components/Countdown";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Foto = { id: string; url: string; alt: string; ordem: number };

export default function Home() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [dataCasamento, setDataCasamento] = useState("2025-07-26T16:00:00");

  useEffect(() => {
    supabase
      .from("config")
      .select("chave, valor")
      .eq("chave", "data_casamento")
      .single()
      .then(({ data }) => {
        if (data?.valor) setDataCasamento(data.valor);
      });
    supabase
      .from("fotos")
      .select("id, url, alt, ordem")
      .eq("secao", "home")
      .order("ordem", { ascending: true })
      .then(({ data }) => setFotos(data || []));
  }, []);

  const fotoPrincipal = fotos[0] || null;
  const fotosExtras = fotos.slice(1, 4);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-stone-200 rounded-full opacity-40" />
          <div className="absolute top-32 left-16 w-16 h-16 border border-stone-200 rounded-full opacity-30" />
          <div className="absolute bottom-32 right-10 w-48 h-48 border border-stone-200 rounded-full opacity-30" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-stone-200 rounded-full opacity-40" />
        </div>

        {fotoPrincipal ? (
          <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mb-8 border-4 border-stone-100 shadow-sm">
            <Image
              src={fotoPrincipal.url}
              alt={fotoPrincipal.alt || "Guilherme e Deborah"}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-dashed border-stone-200 mb-8 flex items-center justify-center">
            <p className="font-lato text-xs text-stone-300 tracking-widest text-center px-4">
              Adicione uma foto no painel
            </p>
          </div>
        )}

        <p className="font-lato text-xs tracking-[0.5em] uppercase text-stone-400 mb-6">
          Celebre conosco
        </p>

        <div className="mb-2">
          <h1 className="font-playfair text-6xl md:text-9xl text-stone-700 leading-none">
            Guilherme
          </h1>
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="h-px w-12 md:w-24 bg-stone-300" />
            <span className="font-playfair text-3xl md:text-4xl text-stone-400 italic">
              &
            </span>
            <div className="h-px w-12 md:w-24 bg-stone-300" />
          </div>
          <h1 className="font-playfair text-6xl md:text-9xl text-stone-700 leading-none">
            Deborah
          </h1>
        </div>

        <p className="font-lato text-stone-400 tracking-[0.3em] text-xs md:text-sm mt-6 mb-14">
          {new Date(dataCasamento).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).replace(/^(\d+) de (\w+) de (\d+)$/, (_, d, m, y) =>
            `${d} · ${m.toUpperCase()} · ${y}`
          )}{" "}
          — GOIÂNIA, GO
        </p>

        <Countdown targetDate={dataCasamento} />

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
          <span
            className="text-stone-400 text-lg"
          >
            ✦
          </span>
          <div className="w-1 h-1 rounded-full bg-stone-400" />
        </div>
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-stone-300" />
      </div>

      {/* Fotos extras */}
      {fotosExtras.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div
            className={`grid gap-4 ${fotosExtras.length === 1 ? "grid-cols-1" : fotosExtras.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {fotosExtras.map((foto) => (
              <div
                key={foto.id}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={foto.url}
                  alt={foto.alt || "Guilherme e Deborah"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/galeria"
              className="font-lato text-xs tracking-widest uppercase text-stone-400 border-b border-stone-200 hover:border-stone-500 hover:text-stone-600 transition-colors pb-0.5"
            >
              Ver toda a galeria →
            </Link>
          </div>
        </section>
      )}

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
