export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const timeline = [
  {
    ano: "2020",
    titulo: "O primeiro encontro",
    descricao:
      "Foi em um dia comum que tudo começou. Um olhar, um sorriso e uma história que mal sabia que estava prestes a mudar nossas vidas.",
  },
  {
    ano: "2021",
    titulo: "Nossa primeira viagem",
    descricao:
      "Descobrimos que viajamos bem juntos — e que brigar sobre qual restaurante escolher faz parte da aventura.",
  },
  {
    ano: "2022",
    titulo: "A mudança",
    descricao:
      "Decidimos construir um lar juntos. Com muito amor, algumas discussões sobre decoração e muita pizza.",
  },
  {
    ano: "2023",
    titulo: "O pedido",
    descricao:
      "Em um momento perfeito, a pergunta que mudou tudo. E a resposta que esperávamos.",
  },
  {
    ano: "2025",
    titulo: "O grande dia",
    descricao:
      "E agora, queremos celebrar com as pessoas que mais amamos. Obrigado por fazer parte dessa história.",
  },
];

async function getFotos() {
  const { data } = await supabase
    .from("fotos")
    .select("id, url, alt, ordem")
    .eq("secao", "historia")
    .order("ordem", { ascending: true });
  return data || [];
}

export default async function Historia() {
  const fotos = await getFotos();

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4 text-center">
          Como tudo começou
        </p>
        <h1 className="font-playfair text-5xl text-stone-700 text-center mb-20">
          Nossa História
        </h1>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-stone-200" />

          <div className="space-y-16">
            {timeline.map((item, i) => {
              const foto = fotos[i] || null;
              return (
                <div key={i} className="relative flex gap-10">
                  <div className="relative z-10 flex-shrink-0 w-16 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-stone-400 mt-1" />
                    <span className="font-lato text-xs text-stone-400 tracking-widest mt-2">
                      {item.ano}
                    </span>
                  </div>

                  <div className="pb-2 flex-1">
                    {foto ? (
                      <div className="mb-4 aspect-video overflow-hidden border border-stone-200">
                        <Image
                          src={foto.url}
                          alt={foto.alt || item.titulo}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 h-40 bg-stone-100 flex items-center justify-center border border-stone-200">
                        <span className="font-lato text-xs tracking-widest uppercase text-stone-300">
                          Foto em breve
                        </span>
                      </div>
                    )}

                    <h3 className="font-playfair text-xl text-stone-700 mb-2">
                      {item.titulo}
                    </h3>
                    <p className="font-lato text-sm text-stone-500 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-stone-300" />
            <span className="text-stone-300">✦</span>
            <div className="h-px w-16 bg-stone-300" />
          </div>
          <p className="font-playfair text-2xl text-stone-600 italic">
            &ldquo;E o melhor ainda está por vir.&rdquo;
          </p>
        </div>
      </main>
    </>
  );
}
