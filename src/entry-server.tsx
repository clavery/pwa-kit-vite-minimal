// entry point for the react SSR bundle

import {renderToString} from 'react-dom/server'
import App from './App'
import {Helmet} from "react-helmet";

/**
 * @param {string} _url
 */
export function render(_url: string) {
    const html = renderToString(
        <App/>
    )
    const head = Helmet.renderStatic()
    return {
        html,
        head
    }
}