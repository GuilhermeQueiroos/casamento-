"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Foto = { id: string; url: string; alt: string };

export default function Galeria() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("fotos")
      .select("id, url, alt, ordem")
      .eq("secao", "galeria")
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        setFotos(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4 text-center">
          Momentos especiais
        </p>
        <h1 className="font-playfair text-5xl text-stone-700 text-center mb-16">
          Galeria
        </h1>

        {loading ? (
          <p className="text-center font-lato text-stone-400">Carregando...</p>
        ) : fotos.length === 0 ? (
          <div className="text-center py-24">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-stone-200" />
              <span className="text-stone-200 text-2xl">✦</span>
              <div className="h-px w-16 bg-stone-200" />
            </div>
            <p className="font-playfair text-2xl text-stone-400 mb-3">
              Em breve
            </p>
            <p className="font-lato text-sm text-stone-300 tracking-wide">
              Nossas fotos serão compartilhadas aqui em breve
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {fotos.map((foto) => (
              <div
                key={foto.id}
                className="break-inside-avoid overflow-hidden border border-stone-100 hover:border-stone-300 transition-colors"
              >
                <Image
                  src={foto.url}
                  alt={foto.alt || "Guilherme e Deborah"}
                  width={800}
                  height={600}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
