// entry point for the react SSR bundle

import {renderToString} from 'react-dom/server'
import App from './App'
import {Helmet} from "react-helmet";
import {createQueryClient} from "./state/query-client";
import {useState} from "react";
import {QueryClientProvider} from "@tanstack/react-query";

const AppWrapper = () => {
    // SSR query clients should be unique per SSR render and not module/process level
    const [queryClient] = useState(
        () => createQueryClient()
    )
    return <QueryClientProvider client={queryClient}><App/></QueryClientProvider>
}

/**
 * @param {string} _url
 */
export function render(_url: string) {
    const html = renderToString(
        <AppWrapper/>
    )
    const head = Helmet.renderStatic()
    return {
        html,
        head
    }
}