"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const SENHA_ADMIN = "casamento2025";
const SECOES = [
  { key: "home", label: "Home", desc: "Foto principal da página inicial" },
  { key: "galeria", label: "Galeria", desc: "Fotos da galeria do casal" },
  { key: "historia", label: "Nossa História", desc: "Fotos da timeline" },
];

type Foto = {
  id: string;
  url: string;
  alt: string;
  secao: string;
  ordem: number;
  created_at: string;
};

export default function FotosAdmin() {
  const [authed, setAuthed] = useState(false);
  const [senha, setSenha] = useState("");
  const [secaoAtiva, setSecaoAtiva] = useState("home");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("noivos_authed") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    carregarFotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, secaoAtiva]);

  async function carregarFotos() {
    const { data } = await supabase
      .from("fotos")
      .select("*")
      .eq("secao", secaoAtiva)
      .order("ordem", { ascending: true });
    setFotos(data || []);
  }

  function selecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setArquivo(file);
    setPreview(URL.createObjectURL(file));
    setAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  }

  async function uploadFoto() {
    if (!arquivo) return;
    setUploading(true);

    const ext = arquivo.name.split(".").pop();
    const nome = `${secaoAtiva}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("fotos")
      .upload(nome, arquivo, { upsert: true });

    if (uploadError) {
      alert("Erro no upload: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("fotos").getPublicUrl(nome);

    await supabase.from("fotos").insert([
      {
        url: urlData.publicUrl,
        alt: alt || "Guilherme e Deborah",
        secao: secaoAtiva,
        ordem: fotos.length,
      },
    ]);

    setArquivo(null);
    setPreview(null);
    setAlt("");
    if (inputRef.current) inputRef.current.value = "";
    await carregarFotos();
    setUploading(false);
  }

  async function removerFoto(foto: Foto) {
    const path = foto.url.split("/fotos/")[1];
    await supabase.storage.from("fotos").remove([path]);
    await supabase.from("fotos").delete().eq("id", foto.id);
    setFotos((prev) => prev.filter((f) => f.id !== foto.id));
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-stone-50">
        <div className="w-full max-w-sm text-center">
          <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4">
            Área restrita
          </p>
          <h1 className="font-playfair text-4xl text-stone-700 mb-2">
            Gerenciar Fotos
          </h1>
          <p className="font-lato text-sm text-stone-400 mb-8">
            Área dos noivos
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (senha === SENHA_ADMIN
                ? setAuthed(true)
                : alert("Senha incorreta"))
            }
            placeholder="Senha"
            className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent mb-4 text-center tracking-widest"
          />
          <button
            onClick={() =>
              senha === SENHA_ADMIN ? setAuthed(true) : alert("Senha incorreta")
            }
            className="w-full py-3 bg-stone-700 text-stone-50 font-lato text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Entrar
          </button>
          <Link
            href="/noivos"
            className="block mt-4 font-lato text-xs text-stone-300 hover:text-stone-500 tracking-widest uppercase transition-colors"
          >
            ← Voltar ao painel
          </Link>
        </div>
      </main>
    );
  }

  const secaoInfo = SECOES.find((s) => s.key === secaoAtiva)!;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-playfair text-3xl text-stone-700">
            Gerenciar Fotos
          </h1>
          <p className="font-lato text-sm text-stone-400 mt-1">
            Upload e organização de fotos do site
          </p>
        </div>
        <Link
          href="/noivos"
          className="text-xs text-stone-400 hover:text-stone-600 tracking-widest uppercase border border-stone-200 px-4 py-2 hover:border-stone-400 transition-colors"
        >
          ← Painel
        </Link>
      </div>

      {/* Seletor de seção */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {SECOES.map((s) => (
          <button
            key={s.key}
            onClick={() => setSecaoAtiva(s.key)}
            className={`p-6 border text-left transition-all ${secaoAtiva === s.key ? "border-stone-600 bg-stone-50" : "border-stone-200 hover:border-stone-400"}`}
          >
            <p
              className={`font-playfair text-xl mb-1 ${secaoAtiva === s.key ? "text-stone-800" : "text-stone-600"}`}
            >
              {s.label}
            </p>
            <p className="font-lato text-xs text-stone-400">{s.desc}</p>
            <p className="font-lato text-xs text-stone-300 mt-2">
              {fotos.filter((f) => f.secao === s.key).length} foto
              {fotos.filter((f) => f.secao === s.key).length !== 1 ? "s" : ""}
            </p>
          </button>
        ))}
      </div>

      {/* Upload */}
      <div className="border border-stone-200 p-6 mb-8">
        <p className="font-lato text-xs tracking-widest uppercase text-stone-400 mb-4">
          Adicionar foto — {secaoInfo.label}
        </p>

        {/* Área de drop */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors cursor-pointer p-8 text-center mb-4 relative overflow-hidden"
        >
          {preview ? (
            <div className="relative w-full h-48">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div>
              <p className="font-playfair text-2xl text-stone-300 mb-2">+</p>
              <p className="font-lato text-sm text-stone-400">
                Clique para selecionar uma foto
              </p>
              <p className="font-lato text-xs text-stone-300 mt-1">
                JPG, PNG, WEBP — até 10MB
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={selecionarArquivo}
            className="hidden"
          />
        </div>

        {arquivo && (
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-1">
                Descrição da foto
              </label>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Ex: Guilherme e Deborah no parque"
                className="w-full border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
              />
            </div>
            <button
              onClick={uploadFoto}
              disabled={uploading}
              className="px-6 py-2 bg-stone-700 text-stone-50 font-lato text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? "Enviando..." : "↑ Enviar foto"}
            </button>
            <button
              onClick={() => {
                setArquivo(null);
                setPreview(null);
                setAlt("");
              }}
              className="px-4 py-2 border border-stone-200 text-stone-400 font-lato text-xs hover:border-stone-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Grid de fotos */}
      <div>
        <p className="font-lato text-sm text-stone-400 mb-4">
          {fotos.length} foto{fotos.length !== 1 ? "s" : ""} na seção{" "}
          {secaoInfo.label}
        </p>
        {fotos.length === 0 ? (
          <div className="border border-dashed border-stone-200 p-12 text-center">
            <p className="font-lato text-sm text-stone-300">
              Nenhuma foto adicionada ainda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.map((foto) => (
              <div
                key={foto.id}
                className="group relative aspect-square border border-stone-200 overflow-hidden"
              >
                <Image
                  src={foto.url}
                  alt={foto.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/60 transition-all flex items-center justify-center">
                  <button
                    onClick={() => removerFoto(foto)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 bg-red-500 text-white font-lato text-xs tracking-widest uppercase"
                  >
                    Remover
                  </button>
                </div>
                {foto.alt && (
                  <div className="absolute bottom-0 left-0 right-0 bg-stone-900/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-lato text-xs text-white truncate">
                      {foto.alt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
