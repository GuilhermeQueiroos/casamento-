"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  nomes_acompanhantes: string;
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

export default function Noivos() {
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
  const [novoConvidado, setNovoConvidado] = useState({
    nome: "",
    email: "",
    telefone: "",
    acompanhantes: 0,
    nomes_acompanhantes: [] as string[],
    confirmado: true,
  });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const recarregar = useCallback(async () => {
    const [{ data: c }, { data: p }] = await Promise.all([
      supabase
        .from("convidados")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("presentes")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    setConvidados(c || []);
    setPresentes(p || []);
  }, []);

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
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  function setQtdAcomp(n: number) {
    const arr = Array(n)
      .fill("")
      .map((_, i) => novoConvidado.nomes_acompanhantes[i] || "");
    setNovoConvidado({
      ...novoConvidado,
      acompanhantes: n,
      nomes_acompanhantes: arr,
    });
  }

  function setNomeAcomp(i: number, val: string) {
    const arr = [...novoConvidado.nomes_acompanhantes];
    arr[i] = val;
    setNovoConvidado({ ...novoConvidado, nomes_acompanhantes: arr });
  }

  async function salvarConfig() {
    setSalvando(true);
    for (const [chave, valor] of Object.entries(config)) {
      await supabase.from("config").upsert({ chave, valor });
    }
    setSalvando(false);
    setMsg("Configurações salvas!");
    setTimeout(() => setMsg(""), 3000);
  }

  async function adicionarConvidado() {
    if (!novoConvidado.nome) return;
    const payload = {
      ...novoConvidado,
      nomes_acompanhantes: novoConvidado.nomes_acompanhantes
        .filter(Boolean)
        .join(", "),
    };
    const { data } = await supabase
      .from("convidados")
      .insert([payload])
      .select();
    if (data) setConvidados((prev) => [data[0], ...prev]);
    setNovoConvidado({
      nome: "",
      email: "",
      telefone: "",
      acompanhantes: 0,
      nomes_acompanhantes: [],
      confirmado: true,
    });
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

  function exportarCSV() {
    const headers = [
      "Nome",
      "Email",
      "Telefone",
      "Confirmado",
      "Acompanhantes",
      "Nomes Acompanhantes",
      "Mensagem",
      "Data",
    ];
    const rows = convidados.map((c) => [
      c.nome,
      c.email || "",
      c.telefone || "",
      c.confirmado ? "Sim" : "Não",
      c.acompanhantes,
      c.nomes_acompanhantes || "",
      c.mensagem || "",
      new Date(c.created_at).toLocaleDateString("pt-BR"),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "convidados.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-stone-50">
        <div className="w-full max-w-sm text-center">
          <p className="font-lato text-xs tracking-[0.4em] uppercase text-stone-400 mb-4">
            Área restrita
          </p>
          <h1 className="font-playfair text-4xl text-stone-700 mb-2">
            Guilherme & Deborah
          </h1>
          <p className="font-lato text-sm text-stone-400 mb-10">
            Área dos noivos
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-stone-300 text-sm">✦</span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
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
            href="/"
            className="block mt-6 font-lato text-xs text-stone-300 hover:text-stone-500 tracking-widest uppercase transition-colors"
          >
            ← Voltar ao site
          </Link>
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
        <div className="flex items-center gap-4">
          <h1 className="font-playfair text-3xl text-stone-700">
            Área dos Noivos
          </h1>
          <button
            onClick={recarregar}
            className="text-xs text-stone-400 hover:text-stone-600 tracking-widest uppercase border border-stone-200 px-3 py-1 hover:border-stone-400 transition-colors"
          >
            ↻ Atualizar
          </button>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="text-xs text-stone-400 hover:text-stone-600 tracking-widest uppercase"
        >
          Sair
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Confirmados", value: confirmados.length },
          { label: "Total de pessoas", value: totalPessoas },
          {
            label: "Pendentes",
            value: convidados.filter((c) => !c.confirmado).length,
          },
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
          {/* Form adicionar */}
          <div className="border border-stone-200 p-6 mb-8">
            <p className="font-lato text-xs tracking-widest uppercase text-stone-400 mb-4">
              Adicionar convidado
            </p>
            <div className="grid grid-cols-2 gap-4">
              <input
                value={novoConvidado.nome}
                onChange={(e) =>
                  setNovoConvidado({ ...novoConvidado, nome: e.target.value })
                }
                placeholder="Nome completo *"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent col-span-2"
              />
              <input
                value={novoConvidado.email}
                onChange={(e) =>
                  setNovoConvidado({ ...novoConvidado, email: e.target.value })
                }
                placeholder="E-mail"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent"
              />
              <input
                value={novoConvidado.telefone}
                onChange={(e) =>
                  setNovoConvidado({
                    ...novoConvidado,
                    telefone: e.target.value,
                  })
                }
                placeholder="Telefone"
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent"
              />
              <select
                value={novoConvidado.acompanhantes}
                onChange={(e) => setQtdAcomp(Number(e.target.value))}
                className="border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-stone-50 col-span-2"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n === 0
                      ? "Sem acompanhantes"
                      : `+${n} acompanhante${n > 1 ? "s" : ""}`}
                  </option>
                ))}
              </select>

              {/* Nomes dos acompanhantes */}
              {novoConvidado.acompanhantes > 0 && (
                <div className="col-span-2 space-y-2">
                  <p className="font-lato text-xs tracking-widest uppercase text-stone-400">
                    Nomes dos acompanhantes
                  </p>
                  {novoConvidado.nomes_acompanhantes.map((n, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-lato text-xs text-stone-400 w-5">
                        {i + 1}.
                      </span>
                      <input
                        value={n}
                        onChange={(e) => setNomeAcomp(i, e.target.value)}
                        placeholder={`Acompanhante ${i + 1}`}
                        className="flex-1 border border-stone-200 px-4 py-2 font-lato text-sm text-stone-700 focus:outline-none bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center gap-2 font-lato text-sm text-stone-600 col-span-2">
                <input
                  type="checkbox"
                  checked={novoConvidado.confirmado}
                  onChange={(e) =>
                    setNovoConvidado({
                      ...novoConvidado,
                      confirmado: e.target.checked,
                    })
                  }
                />
                Já confirmado
              </label>
            </div>
            <button
              onClick={adicionarConvidado}
              className="mt-4 px-6 py-2 bg-stone-700 text-stone-50 font-lato text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors"
            >
              Adicionar
            </button>
          </div>

          {/* Header lista */}
          <div className="flex items-center justify-between mb-4">
            <p className="font-lato text-sm text-stone-400">
              {convidados.length} convidado{convidados.length !== 1 ? "s" : ""}{" "}
              · {totalPessoas} pessoas no total
            </p>
            <button
              onClick={exportarCSV}
              className="font-lato text-xs tracking-widest uppercase text-stone-500 border border-stone-200 px-4 py-2 hover:border-stone-400 transition-colors"
            >
              ↓ Exportar CSV
            </button>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {convidados.map((c) => (
              <div key={c.id} className="border border-stone-200 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-lato text-stone-700 font-medium">
                      {c.nome}
                    </p>
                    <p className="font-lato text-xs text-stone-400 mt-0.5">
                      {c.email && `${c.email}`}
                      {c.telefone && ` · ${c.telefone}`}
                    </p>
                    {c.acompanhantes > 0 && (
                      <div className="mt-2">
                        <p className="font-lato text-xs text-stone-500">
                          +{c.acompanhantes} acompanhante
                          {c.acompanhantes > 1 ? "s" : ""}
                          {c.nomes_acompanhantes && (
                            <span className="text-stone-400">
                              {" "}
                              — {c.nomes_acompanhantes}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {c.mensagem && (
                      <p className="font-lato text-xs text-stone-400 italic mt-1">
                        {c.mensagem}
                      </p>
                    )}
                    <p className="font-lato text-xs text-stone-300 mt-1">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`text-xs tracking-widest uppercase font-lato px-3 py-1 flex-shrink-0 ${c.confirmado ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-400"}`}
                    >
                      {c.confirmado ? "Confirmado" : "Pendente"}
                    </span>
                    <button
                      onClick={() => removerConvidado(c.id)}
                      className="text-stone-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presentes */}
      {aba === "presentes" && (
        <div>
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
