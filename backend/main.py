from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DadosIMC(BaseModel):
    peso: float = Field(gt=0)
    altura: float = Field(gt=0)

def calcular_percentil(imc, media, desvio_padrao=5.0):
    z_score = (imc - media) / desvio_padrao
    percentil = 0.5 * (1.0 + math.erf(z_score / math.sqrt(2.0)))
    return round(percentil * 100, 1)

@app.post("/calcular-imc")
async def calcular(dados: DadosIMC):
    imc = round(dados.peso / (dados.altura ** 2), 2)
    
    # Peso ideal máximo (IMC 24.9)
    peso_ideal_max = round(24.9 * (dados.altura ** 2), 1)
    kg_a_perder = round(dados.peso - peso_ideal_max, 1) if dados.peso > peso_ideal_max else 0
    
    # 1kg de gordura ~= 7700 kcal
    calorias_totais = int(kg_a_perder * 7700)

    medias_paises = {"Brasil": 26.5, "EUA": 28.5, "Inglaterra": 27.3}
    comparacao = {}
    
    for pais, media in medias_paises.items():
        perc = calcular_percentil(imc, media)
        comparacao[pais] = f"Você está acima de {perc}% da população."

    return {
        "imc": imc,
        "kg_a_perder": kg_a_perder,
        "calorias": f"{calorias_totais:,}".replace(",", "."),
        "comparacao": comparacao
    }