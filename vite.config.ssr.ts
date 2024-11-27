import { defineConfig } from "vite";

export default defineConfig({
    build: {
        ssr: "ssr.js",
        target: "node20",
        rollupOptions: {
            output: {
                format: "cjs",
                // MRT requires a js extension
                entryFileNames: "[name].js"
            }
        }
    },
    ssr: {
        // setting to true seems to conflict with target: "node" externalizing
        noExternal: /.*/,
        target: "node"
    },
});