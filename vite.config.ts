import path from "path"
import {defineConfig} from 'vite'
import { reactRouter } from "@react-router/dev/vite";

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [reactRouter()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        sourcemap: true
    },
    ssr: {
        noExternal: mode === 'production' ? true : undefined
    }
}))
