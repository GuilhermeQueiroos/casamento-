import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

async function getConfig() {
  const { data } = await supabase.from("config").select("chave, valor");
  const cfg: Record<string, string> = {};
  data?.forEach((r) => {
    cfg[r.chave] = r.valor;
  });
  return cfg;
}

export default async function Evento() {
  const cfg = await getConfig();

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4 text-center">
          O grande dia
        </p>
        <h1 className="font-playfair text-5xl text-stone-700 text-center mb-16">
          O Evento
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cerimônia */}
          <div className="border border-stone-200 p-8">
            <p className="font-lato text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
              Cerimônia
            </p>
            <p className="font-playfair text-2xl text-stone-700 mb-2">
              {cfg.hora_cerimonia || "A definir"}
            </p>
            <p className="font-lato text-stone-600 mb-1">
              {cfg.local_cerimonia || "A definir"}
            </p>
            <p className="font-lato text-sm text-stone-400">
              {cfg.endereco_cerimonia || ""}
            </p>
            {cfg.endereco_cerimonia &&
              cfg.endereco_cerimonia !== "A definir" && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(cfg.endereco_cerimonia)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-xs tracking-widest uppercase text-stone-500 border-b border-stone-300 hover:border-stone-600 transition-colors"
                >
                  Ver no mapa →
                </a>
              )}
          </div>

          {/* Recepção */}
          <div className="border border-stone-200 p-8">
            <p className="font-lato text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
              Recepção
            </p>
            <p className="font-playfair text-2xl text-stone-700 mb-2">
              {cfg.hora_recepcao || "A definir"}
            </p>
            <p className="font-lato text-stone-600 mb-1">
              {cfg.local_recepcao || "A definir"}
            </p>
            <p className="font-lato text-sm text-stone-400">
              {cfg.endereco_recepcao || ""}
            </p>
            {cfg.endereco_recepcao && cfg.endereco_recepcao !== "A definir" && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(cfg.endereco_recepcao)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-xs tracking-widest uppercase text-stone-500 border-b border-stone-300 hover:border-stone-600 transition-colors"
              >
                Ver no mapa →
              </a>
            )}
          </div>
        </div>

        {/* Data */}
        <div className="mt-8 border border-stone-200 p-8 text-center">
          <p className="font-lato text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
            Data
          </p>
          <p className="font-playfair text-3xl text-stone-700">
            {cfg.data_casamento
              ? new Date(cfg.data_casamento).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "A definir"}
          </p>
        </div>

        {/* Dress code */}
        <div className="mt-8 text-center">
          <p className="font-lato text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">
            Dress code
          </p>
          <p className="font-playfair text-xl text-stone-600">Esporte fino</p>
        </div>
      </main>
    </>
  );
}
