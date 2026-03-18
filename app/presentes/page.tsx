"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Presente = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  link_compra: string;
  reservado: boolean;
  reservado_por: string;
};

export default function Presentes() {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservando, setReservando] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [presenteSelecionado, setPresenteSelecionado] = useState<string | null>(
    null,
  );

  useEffect(() => {
    supabase
      .from("presentes")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setPresentes(data || []);
        setLoading(false);
      });
  }, []);

  async function reservar(id: string) {
    if (!nome.trim()) return;
    setReservando(id);
    await supabase
      .from("presentes")
      .update({ reservado: true, reservado_por: nome })
      .eq("id", id);
    setPresentes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, reservado: true, reservado_por: nome } : p,
      ),
    );
    setReservando(null);
    setPresenteSelecionado(null);
    setNome("");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4 text-center">
          Presente com carinho
        </p>
        <h1 className="font-playfair text-5xl text-stone-700 text-center mb-4">
          Lista de Presentes
        </h1>
        <p className="font-lato text-sm text-stone-400 text-center mb-16">
          Sua presença já é o maior presente. Mas se quiser nos presentear, aqui
          estão algumas sugestões.
        </p>

        {loading ? (
          <p className="text-center font-lato text-stone-400">Carregando...</p>
        ) : presentes.length === 0 ? (
          <p className="text-center font-lato text-stone-400">
            Lista ainda não disponível.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presentes.map((p) => (
              <div
                key={p.id}
                className={`border p-6 transition-colors ${p.reservado ? "border-stone-200 opacity-60" : "border-stone-200 hover:border-stone-400"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-playfair text-xl text-stone-700">
                    {p.nome}
                  </h3>
                  {p.reservado && (
                    <span className="font-lato text-xs tracking-widest uppercase text-amber-600 bg-amber-50 px-2 py-1">
                      Reservado
                    </span>
                  )}
                </div>

                {p.descricao && (
                  <p className="font-lato text-sm text-stone-400 mb-2">
                    {p.descricao}
                  </p>
                )}

                {p.preco && (
                  <p className="font-lato text-sm text-stone-500 mb-4">
                    R$ {Number(p.preco).toFixed(2).replace(".", ",")}
                  </p>
                )}

                {!p.reservado && (
                  <>
                    {presenteSelecionado === p.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Seu nome"
                          className="flex-1 border border-stone-200 px-3 py-2 font-lato text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
                        />
                        <button
                          onClick={() => reservar(p.id)}
                          disabled={reservando === p.id || !nome.trim()}
                          className="px-4 py-2 bg-stone-700 text-stone-50 font-lato text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-50"
                        >
                          {reservando === p.id ? "..." : "OK"}
                        </button>
                        <button
                          onClick={() => setPresenteSelecionado(null)}
                          className="px-3 py-2 border border-stone-200 text-stone-400 text-xs hover:border-stone-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => setPresenteSelecionado(p.id)}
                          className="font-lato text-xs tracking-widest uppercase text-stone-500 border-b border-stone-300 hover:border-stone-600 transition-colors"
                        >
                          Quero dar este presente
                        </button>
                        {p.link_compra && (
                          <a
                            href={p.link_compra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-lato text-xs tracking-widest uppercase text-stone-400 border-b border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            Ver produto →
                          </a>
                        )}
                      </div>
                    )}
                  </>
                )}

                {p.reservado && p.reservado_por && (
                  <p className="font-lato text-xs text-stone-400 mt-2">
                    Por {p.reservado_por}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
