from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DadosSaude(BaseModel):
    peso: float
    altura: float
    idade: int
    genero: str
    cintura: Optional[float] = None
    nivel_esforco: str

@app.post("/analise-completa")
async def analisar(dados: DadosSaude):
    altura_m = dados.altura if dados.altura < 3 else dados.altura / 100
    altura_cm = altura_m * 100

    imc = round(dados.peso / (altura_m ** 2), 1)
    
    if dados.genero == "M":
        tmb = (10 * dados.peso) + (6.25 * altura_cm) - (5 * dados.idade) + 5
    else:
        tmb = (10 * dados.peso) + (6.25 * altura_cm) - (5 * dados.idade) - 161

    litros_agua = round((dados.peso * 35) / 1000, 1)
    peso_ideal_max = round(24.9 * (altura_m ** 2), 1)

    return {
        "imc": imc,
        "tmb": int(tmb),
        "dicas": [
            f"Beba exatamente {litros_agua} litros de água por dia para seu peso atual.",
            "Priorize proteínas magras para preservar seus músculos.",
            "Mantenha constância nos treinos para acelerar o metabolismo."
        ],
        "faixa_saudavel": {"max": peso_ideal_max}
    }