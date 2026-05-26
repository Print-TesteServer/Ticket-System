import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function ticketosDevBanner() {
  return {
    name: 'ticketos-dev-banner',
    configureServer() {
      return () => {
        console.log(
          '\n  ========================================================\n' +
            '   TicketOS — Interface (local, porta 5173)\n' +
            '  ========================================================\n' +
            '   Login:     http://localhost:5173/login\n' +
            '   Chamados:  http://localhost:5173/\n' +
            '   Novo:      http://localhost:5173/new\n' +
            '   API Docs:  http://localhost:8000/docs  (backend em outro terminal)\n' +
            '  ========================================================\n',
        )
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), ticketosDevBanner()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
