import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Necessário para o GitHub Pages não quebrar as imagens
  },
  reactCompiler: true,
};

export default nextConfig;