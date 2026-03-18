"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RSVP() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    acompanhantes: 0,
    mensagem: "",
    confirmado: true,
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("convidados").insert([form]);
    setStatus(error ? "error" : "success");
  }

  if (status === "success") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-4xl mb-6">✦</p>
            <h1 className="font-playfair text-4xl text-stone-700 mb-4">
              Presença confirmada!
            </h1>
            <p className="font-lato text-stone-400">
              Mal podemos esperar para celebrar com você, {form.nome}.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-6 pt-32 pb-24">
        <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4 text-center">
          Sua presença é um presente
        </p>
        <h1 className="font-playfair text-5xl text-stone-700 text-center mb-12">
          Confirmar Presença
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-2">
              Nome completo *
            </label>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-2">
              Telefone
            </label>
            <input
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
              placeholder="(62) 99999-9999"
            />
          </div>

          <div>
            <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-2">
              Acompanhantes
            </label>
            <select
              value={form.acompanhantes}
              onChange={(e) =>
                setForm({ ...form, acompanhantes: Number(e.target.value) })
              }
              className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0
                    ? "Somente eu"
                    : `+${n} acompanhante${n > 1 ? "s" : ""}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-2">
              Mensagem (opcional)
            </label>
            <textarea
              value={form.mensagem}
              onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
              rows={4}
              className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent resize-none"
              placeholder="Deixe uma mensagem para os noivos..."
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500 font-lato">
              Erro ao confirmar. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 bg-stone-700 text-stone-50 font-lato text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Confirmar Presença"}
          </button>
        </form>
      </main>
    </>
  );
}
