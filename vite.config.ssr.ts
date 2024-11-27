import { defineConfig } from "vite";

import packageJson from "./package.json";

const dependencies = Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
});

export default defineConfig({
    build: {
        ssr: "ssr.js",
        target: "node20"
    },
    ssr: {
        noExternal: dependencies,
    },
});