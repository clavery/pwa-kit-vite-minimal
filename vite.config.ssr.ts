// MRT SSR entry point build specifics
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        emptyOutDir: false,
        sourcemap: true,
        ssr: "ssr.js",
        target: "node20",
        rollupOptions: {
            output: {
                format: "cjs",
                // MRT requires a js extension
                entryFileNames: "[name].js",
                chunkFileNames: "assets/[name]-[hash].js",
            }
        },
    },
    experimental: {
        renderBuiltUrl(filename, { hostType }) {
            if (hostType === 'js') {
                return { runtime: `window._BASE_URL + ${JSON.stringify(filename)})` }
            } else {
                return { relative: true }
            }
        },
    },
    ssr: {
        // setting to true seems to conflict with target: "node" externalizing
        noExternal: /.*/,
        target: "node"
    },
});