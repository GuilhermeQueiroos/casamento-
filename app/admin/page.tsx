"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const SENHA_ADMIN = "casamento2025";

type Config = Record<string, string>;
type Convidado = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  confirmado: boolean;
  acompanhantes: number;
  mensagem: string;
  created_at: string;
};
type Presente = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  link_compra: string;
  reservado: boolean;
  reservado_por: string;
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [senha, setSenha] = useState("");
  const [aba, setAba] = useState<"config" | "convidados" | "presentes">(
    "config",
  );
  const [config, setConfig] = useState<Config>({});
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [novoPresente, setNovoPresente] = useState({
    nome: "",
    descricao: "",
    preco: "",
    link_compra: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authed) return;
    supabase
      .from("config")
      .select("chave, valor")
      .then(({ data }) => {
        const cfg: Config = {};
        data?.forEach((r) => {
          cfg[r.chave] = r.valor;
        });
        setConfig(cfg);
      });
    supabase
      .from("convidados")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setConvidados(data || []));
    supabase
      .from("presentes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPresentes(data || []));
  }, [authed]);

  async function salvarConfig() {
    setSalvando(true);
    for (const [chave, valor] of Object.entries(config)) {
      await supabase.from("config").upsert({ chave, valor });
    }
    setSalvando(false);
    setMsg("Configurações salvas!");
    setTimeout(() => setMsg(""), 3000);
  }

  async function adicionarPresente() {
    if (!novoPresente.nome) return;
    const { data } = await supabase
      .from("presentes")
      .insert([
        {
          ...novoPresente,
          preco: novoPresente.preco ? parseFloat(novoPresente.preco) : null,
        },
      ])
      .select();
    if (data) setPresentes((prev) => [data[0], ...prev]);
    setNovoPresente({ nome: "", descricao: "", preco: "", link_compra: "" });
  }

  async function removerPresente(id: string) {
    await supabase.from("presentes").delete().eq("id", id);
    setPresentes((prev) => prev.filter((p) => p.id !== id));
  }

  async function removerConvidado(id: string) {
    await supabase.from("convidados").delete().eq("id", id);
    setConvidados((prev) => prev.filter((c) => c.id !== id));
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-playfair text-3xl text-stone-700 text-center mb-8">
            Painel Admin
          </h1>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && senha === SENHA_ADMIN && setAuthed(true)
            }
            placeholder="Senha"
            className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent mb-4"
          />
          <button
            onClick={() =>
              senha === SENHA_ADMIN ? setAuthed(true) : alert("Senha incorreta")
            }
            className="w-full py-3 bg-stone-700 text-stone-50 font-lato text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Entrar
          </button>
        </div>
      </main>
    );
  }

  const confirmados = convidados.filter((c) => c.confirmado);
  const totalPessoas = confirmados.reduce(
    (acc, c) => acc + 1 + (c.acompanhantes || 0),
    0,
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-playfair text-3xl text-stone-700">Painel Admin</h1>
        <button
          onClick={() => setAuthed(false)}
          className="text-xs text-stone-400 hover:text-stone-600 tracking-widest uppercase"
        >
          Sair
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Confirmados", value: confirmados.length },
          { label: "Total de pessoas", value: totalPessoas },
          { label: "Presentes", value: presentes.length },
        ].map((s) => (
          <div
            key={s.label}
            className="border border-stone-200 p-6 text-center"
          >
            <p className="font-playfair text-4xl text-stone-700">{s.value}</p>
            <p className="font-lato text-xs tracking-widest uppercase text-stone-400 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div className="flex gap-6 border-b border-stone-200 mb-8">
        {(["config", "convidados", "presentes"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className={`pb-3 font-lato text-xs tracking-widest uppercase transition-colors ${aba === a ? "text-stone-700 border-b-2 border-stone-700" : "text-stone-400 hover:text-stone-600"}`}
          >
            {a === "config"
              ? "Configurações"
              : a === "convidados"
                ? "Convidados"
                : "Presentes"}
          </button>
        ))}
      </div>

      {/* Config */}
      {aba === "config" && (
        <div className="space-y-4 max-w-lg">
          {[
            {
              key: "data_casamento",
              label: "Data do casamento",
              type: "datetime-local",
            },
            { key: "hora_cerimonia", label: "Hora da cerimônia", type: "time" },
            { key: "hora_recepcao", label: "Hora da recepção", type: "time" },
            {
              key: "local_cerimonia",
              label: "Local da cerimônia",
              type: "text",
            },
            {
              key: "endereco_cerimonia",
              label: "Endereço da cerimônia",
              type: "text",
            },
            { key: "local_recepcao", label: "Local da recepção", type: "text" },
            {
              key: "endereco_recepcao",
              label: "Endereço da recepção",
              type: "text",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="block font-lato text-xs tracking-widest uppercase text-stone-400 mb-1">
                {f.label}
              </label>
              <input
                type={f.type}
                value={config[f.key] || ""}
                onChange={(e) =>
                  setConfig({ ...config, [f.key]: e.target.value })
                }
                className="w-full border border-stone-200 px-4 py-3 font-lato text-stone-700 focus:outline-none focus:border-stone-400 bg-transparent"
              />
            </div>
          ))}
          <button
            onClick={salvarConfig}
            disabled={salvando}
            className="mt-4 px-8 py-3 bg-stone-700 text-stone-50 font-lato text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          {msg && <p className="text-sm text-green-600 font-lato">{msg}</p>}
        </div>
      )}

      {/* Convidados */}
      {aba === "convidados" && (
        <div>
          <p className="font-lato text-sm text-stone-400 mb-6">
            {convidados.length} convidado{convidados.length !== 1 ? "s" : ""}{" "}
            cadastrado{convidados.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {convidados.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border border-stone-200 px-6 py-4"
              >
                <div>
                  <p className="font-lato text-stone-700 font-medium">
                    {c.nome}
                  </p>
                  <p className="font-lato text-xs text-stone-400">
                    {c.email} {c.telefone && `· ${c.telefone}`}{" "}
                    {c.acompanhantes > 0 && `· +${c.acompanhantes} acomp.`}
                  </p>
                  {c.mensagem && (
                    <p className="font-lato text-xs text-stone-400 italic mt-1">
                      &ldquo;{c.mensagem}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs tracking-widest uppercase font-lato px-3 py-1 ${c.confirmado ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-400"}`}
                  >
                    {c.confirmado ? "Confirmado" : "Pendente"}
                  </span>
                  <button
                    onClick={() => removerConvidado(c.id)}
                    className="text-stone-300 hover:text-red-400 transition-colors text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presentes */}
      {aba === "presentes" && (
        <div>
          {/* Formulário novo presente */}
          <div className="border border-stone-200 p-6 mb-8">
            <p className="font-lato text-xs tracking-widest uppercase text-stone-400 mb-4">
              Adicionar presente
            </p>
            <div className="grid grid-cols-2 gap-4">
              <input
                value={novoPresente.nome}
                onChange={(e) =>
                  setNovoPresente({ ...novoPresente, nome: e.target.value })
                }
                placeholder="Nome do presente *"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent col-span-2"
              />
              <input
                value={novoPresente.descricao}
                onChange={(e) =>
                  setNovoPresente({
                    ...novoPresente,
                    descricao: e.target.value,
                  })
                }
                placeholder="Descrição"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent"
              />
              <input
                value={novoPresente.preco}
                onChange={(e) =>
                  setNovoPresente({ ...novoPresente, preco: e.target.value })
                }
                placeholder="Preço (ex: 150.00)"
                type="number"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent"
              />
              <input
                value={novoPresente.link_compra}
                onChange={(e) =>
                  setNovoPresente({
                    ...novoPresente,
                    link_compra: e.target.value,
                  })
                }
                placeholder="Link de compra"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent col-span-2"
              />
            </div>
            <button
              onClick={adicionarPresente}
              className="mt-4 px-6 py-2 bg-stone-700 text-stone-50 font-lato text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors"
            >
              Adicionar
            </button>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {presentes.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-stone-200 px-6 py-4"
              >
                <div>
                  <p className="font-lato text-stone-700 font-medium">
                    {p.nome}
                  </p>
                  <p className="font-lato text-xs text-stone-400">
                    {p.preco && `R$ ${Number(p.preco).toFixed(2)}`}
                    {p.descricao && ` · ${p.descricao}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs tracking-widest uppercase font-lato px-3 py-1 ${p.reservado ? "bg-amber-50 text-amber-700" : "bg-stone-100 text-stone-400"}`}
                  >
                    {p.reservado
                      ? `Reservado${p.reservado_por ? ` por ${p.reservado_por}` : ""}`
                      : "Disponível"}
                  </span>
                  <button
                    onClick={() => removerPresente(p.id)}
                    className="text-stone-300 hover:text-red-400 transition-colors text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
