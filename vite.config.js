import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        educacao: resolve(__dirname, 'educacao.html'),
        setorPublico: resolve(__dirname, 'setor-publico.html'),
        setorPrivado: resolve(__dirname, 'setor-privado.html'),
        adocao: resolve(__dirname, 'adocao-cientifica.html'),
        parceiros: resolve(__dirname, 'parceiros.html'),
        termos: resolve(__dirname, 'termos-de-licenciamento.html'),
        politicas: resolve(__dirname, 'politica-de-privacidade.html')
      }
    }
  }
});