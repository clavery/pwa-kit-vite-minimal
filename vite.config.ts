import path from "path"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { reactRouter } from "@react-router/dev/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "commerce-sdk-isomorphic": "./node_modules/commerce-sdk-isomorphic/lib/index.cjs.js",
        },
    },
    build: {
        sourcemap: true
    },
    ssr: {
        noExternal: mode === 'production' ? true : undefined
    }
}))
