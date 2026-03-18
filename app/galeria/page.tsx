"use client";

import Image from "next/image";

// 💡 FUTURO: buscar fotos do Supabase Storage
// import { supabase } from '@/lib/supabase'
// As fotos ficam em: supabase storage → bucket "galeria"
// Para adicionar: no admin, upload para o bucket e salvar a URL no banco
// Para exibir: next/image com src={url} + animação de entrada com framer-motion

import Navbar from "@/components/Navbar";

// 💡 Substituir por fotos reais vindas do Supabase Storage
const fotos: { url: string; alt: string }[] = [
  // Exemplo de como ficará:
  // { url: 'https://...supabase.co/storage/v1/object/public/galeria/foto1.jpg', alt: 'Guilherme e Deborah' },
];

export default function Galeria() {
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

        {fotos.length === 0 ? (
          // Estado vazio — aparece até as fotos serem adicionadas
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
          // 💡 Grid de fotos — pronto para receber imagens reais
          // Futuramente: adicionar framer-motion para animação de entrada
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {fotos.map((foto, i) => (
              <div
                key={i}
                className="break-inside-avoid overflow-hidden border border-stone-100 hover:border-stone-300 transition-colors"
                // 💡 FUTURO: onClick para abrir lightbox
              >
                <Image
                  src={foto.url}
                  alt={foto.alt}
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
