import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Habilita a exportação estática */
  output: 'export',
  
  /* Substitua pelo nome EXATO do seu repositório no GitHub */
  basePath: '/Calculadora-de-Imc---Titi-IMC',

  /* Opcional: Garante que imagens e links funcionem com o caminho acima */
  assetPrefix: '/Calculadora-de-Imc---Titi-IMC/',

  reactCompiler: true,
};

export default nextConfig;