import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/arc/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo.png'],
        manifest: {
          name: 'ARC Habit Tracker',
          short_name: 'ARC',
          description: 'Minimalist Habit Tracking',
          theme_color: '#000000',
          background_color: '#0F0F0F',
          icons: [
            {
              src: '192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ]
  };
});