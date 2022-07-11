import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import Pages from "vite-plugin-pages"
import Components from "unplugin-vue-components/vite"
import legacy from "@vitejs/plugin-legacy"
import Unocss from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import { ElementUiResolver } from "unplugin-vue-components/resolvers"
import Layouts from "vite-plugin-vue-layouts"
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    Unocss(),
    Pages({
      dirs: [{ dir: "src/views/pages", baseRoute: "" }],
      exclude: ["**/components/*.vue"],
    }),
    Layouts(),
    Components({
      resolvers: [ElementUiResolver()],
    }),
    AutoImport({
      /* options */
    }),
  ],
  server: {
    open: true,
    host: "0.0.0.0",
    clearScreen: false,
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    proxy: {
      "/api": {
        target: "",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
})
