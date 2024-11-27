// entry point for the react SSR bundle

import {StrictMode} from 'react'
import {renderToString} from 'react-dom/server'
import App from './App'

/**
 * @param {string} _url
 */
export function render(_url: string) {
    const html = renderToString(
        <StrictMode>
            <App/>
        </StrictMode>,
    )
    // react-helmet, yada yada
    const head = `
    <title>pwa-kit-vite-minimal poc</title>
    `
    return {
        html,
        head
    }
}