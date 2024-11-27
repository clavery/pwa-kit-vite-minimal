import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [react()],
    ssr: {
        noExternal: mode === 'production' ? true : undefined
    }
}))
