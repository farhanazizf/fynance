import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "FYnance - Cashflow Tracker",
        short_name: "FYnance",
        description: "Personal cashflow and expense tracker",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com/,
            handler: "NetworkFirst",
            options: {
              cacheName: "firestore-cache",
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false, // Disable PWA in development to avoid media session errors
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable code splitting optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "firebase-vendor": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
          ],
          "antd-vendor": ["antd", "@ant-design/icons"],
          "chart-vendor": ["chart.js", "react-chartjs-2"],
          "utility-vendor": ["dayjs", "date-fns"],

          // App chunks
          "auth-components": [
            "./src/components/Login.tsx",
            "./src/components/FamilySetup.tsx",
            "./src/contexts/AuthContext.tsx",
          ],
          "main-components": [
            "./src/components/Dashboard.tsx",
            "./src/components/MobileLayout.tsx",
          ],
          "feature-components": [
            "./src/components/AddTransaction.tsx",
            "./src/components/Reports.tsx",
            "./src/components/Categories.tsx",
          ],
        },
        // Use content hash for long-term caching
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: "esnext",
    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Enable gzip compression in preview
  preview: {
    headers: {
      "Cache-Control": "public, max-age=31536000",
    },
  },
});
