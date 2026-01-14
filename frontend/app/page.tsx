"use client";
import { useState } from "react";

export default function TitiIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [res, setRes] = useState<any>(null);

  const enviarDados = async () => {
    const response = await fetch("http://127.0.0.1:8000/calcular-imc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ peso: Number(peso), altura: Number(altura) }),
    });
    const data = await response.json();
    setRes(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-blue-500">
            Titi <span className="text-white">IMC</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Sua análise inteligente</p>
        </header>
        
        <div className="space-y-4">
          <input type="number" placeholder="Peso atual (kg)" value={peso} onChange={(e) => setPeso(e.target.value)}
            className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-blue-500 outline-none transition-all text-center text-xl" />
          
          <input type="number" placeholder="Altura (ex: 1.75)" value={altura} onChange={(e) => setAltura(e.target.value)}
            className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-blue-500 outline-none transition-all text-center text-xl" />
          
          <button onClick={enviarDados} className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg shadow-blue-600/20">
            CALCULAR IMPACTO
          </button>
        </div>

        {res && (
          <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 p-4 rounded-2xl text-center border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Meta de Peso</p>
                <p className="text-2xl font-black text-emerald-400">-{res.kg_a_perder}kg</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-2xl text-center border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Déficit Total</p>
                <p className="text-2xl font-black text-orange-400">{res.calorias} kcal</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-zinc-600 tracking-widest text-center">ANÁLISE POPULACIONAL GLOBAL</p>
              {Object.entries(res.comparacao).map(([pais, info]: any) => (
                <div key={pais} className="flex justify-between items-center bg-zinc-800/30 p-4 rounded-xl">
                  <span className="text-sm font-bold text-zinc-400">{pais}</span>
                  <span className="text-xs text-zinc-200">{info}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}