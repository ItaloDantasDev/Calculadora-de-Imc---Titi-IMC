"use client";
import { useState } from "react";

export default function TitiIMCPro() {
  const [form, setForm] = useState({ 
    peso: "", altura: "", idade: "", genero: "M", 
    cintura: "", usarCintura: false, esforco: "moderado" 
  });
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const consultar = async () => {
    if (!form.peso || !form.altura || !form.idade) {
      alert("Por favor, preencha Peso, Altura e Idade.");
      return;
    }
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${BASE_URL}/analise-completa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso: parseFloat(String(form.peso).replace(',', '.')),
          altura: parseFloat(String(form.altura).replace(',', '.')),
          idade: parseInt(form.idade),
          genero: form.genero,
          cintura: form.usarCintura && form.cintura ? parseFloat(String(form.cintura).replace(',', '.')) : null,
          nivel_esforco: form.esforco
        }),
      });
      const data = await response.json();
      setRes(data);
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 py-12">
      <div className="max-w-xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-black text-blue-500 italic uppercase">Titi IMC</h1>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] grid grid-cols-2 gap-4 shadow-2xl">
          <input placeholder="Peso (kg)" type="number" className="bg-zinc-800 p-4 rounded-xl outline-none" onChange={e => setForm({...form, peso: e.target.value})}/>
          <input placeholder="Altura (m)" type="number" className="bg-zinc-800 p-4 rounded-xl outline-none" onChange={e => setForm({...form, altura: e.target.value})}/>
          <input placeholder="Idade" type="number" className="bg-zinc-800 p-4 rounded-xl outline-none" onChange={e => setForm({...form, idade: e.target.value})}/>
          
          <select className="bg-zinc-800 p-4 rounded-xl outline-none text-zinc-400" onChange={e => setForm({...form, genero: e.target.value})}>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>

          {/* CHECKBOX DA CINTURA - REVISADO */}
          <div className="col-span-2 p-5 bg-zinc-800/40 rounded-3xl border border-zinc-800/50">
            <label className="flex items-center gap-4 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-blue-500" 
                checked={form.usarCintura}
                onChange={e => setForm({...form, usarCintura: e.target.checked})} 
              />
              <span className="text-sm font-bold text-zinc-300">Incluir Medida da Cintura (Atletas)</span>
            </label>
            
            {form.usarCintura && (
              <div className="mt-4 animate-in fade-in zoom-in-95 duration-200">
                <input 
                  placeholder="Cintura em cm" 
                  type="number" 
                  className="bg-zinc-800 p-4 rounded-xl w-full outline-none border border-blue-500/30 focus:border-blue-500 transition-all" 
                  onChange={e => setForm({...form, cintura: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="col-span-2">
            <div className="flex gap-2">
              {['leve', 'moderado', 'intenso'].map(r => (
                <button key={r} onClick={() => setForm({...form, esforco: r})} 
                  className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase transition-all ${form.esforco === r ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button onClick={consultar} disabled={loading} className="col-span-2 bg-white text-black p-5 rounded-2xl font-black uppercase hover:bg-blue-600 hover:text-white transition-all active:scale-95">
            {loading ? "CALCULANDO..." : "GERAR ANÁLISE COMPLETA"}
          </button>
        </div>

        {res && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Status</p>
                    <p className="text-xl font-black text-blue-500">{res.imc}</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Repouso</p>
                    <p className="text-xl font-black text-emerald-500">{res.tmb}</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Meta</p>
                    <p className="text-xl font-black text-orange-500">{res.faixa_saudavel?.max}kg</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem]">
              <p className="text-[10px] font-black text-zinc-500 mb-6 uppercase">Plano de Hidratação e Saúde</p>
              <ul className="space-y-4">
                {res.dicas?.map((d: string, i: number) => (
                  <li key={i} className={`text-sm p-4 rounded-2xl flex gap-3 ${i === 0 ? "bg-blue-500/10 border border-blue-500/20 text-blue-100 font-bold" : "bg-zinc-800/50 text-zinc-400"}`}>
                    <span>{i === 0 ? "💧" : "•"}</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}