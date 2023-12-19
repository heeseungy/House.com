import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.png", "**/*.PNG"], // JPG 파일을 포함하도록 추가
  server: {
    proxy: {
      "/server": {
        // target: "https://3ea3-220-93-153-206.ngrok-free.app",
        target: 'http://127.0.0.1:8080',
        changeOrigin: "true",
        rewrite: (path) => path.replace(/^\/server/, ""),
      },
    },
  },
});
