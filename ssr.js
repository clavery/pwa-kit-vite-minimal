import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {RemoteServerFactory} from '@salesforce/pwa-kit-runtime/ssr/server/build-remote-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isRemote = Object.prototype.hasOwnProperty.call(process.env, 'AWS_LAMBDA_FUNCTION_NAME')
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const options = {
    // The build directory (an absolute path)
    buildDir: path.resolve(process.cwd(), 'build'),

    // The cache time for SSR'd pages (defaults to 600 seconds)
    defaultCacheTimeSeconds: 30,

    // The contents of the config file for the current environment
    mobify: {},

    // The port that the local dev server listens on
    port: port,

    localAllowCookies: true,

    // The protocol on which the development Express app listens.
    // Note that http://localhost is treated as a secure context for development,
    // except by Safari.
    protocol: 'http',

    // Option for whether to set up a special endpoint for handling
    // private SLAS clients
    // Set this to false if using a SLAS public client
    // When setting this to true, make sure to also set the PWA_KIT_SLAS_CLIENT_SECRET
    // environment variable as this endpoint will return HTTP 501 if it is not set
    useSLASPrivateClient: process.env.ENABLE_PRIVATE_CLIENT === 'true',

    // A regex for identifying which SLAS endpoints the custom SLAS private
    // client secret handler will inject an Authorization header.
    applySLASPrivateClientToEndpoints:
        /\/oauth2\/token|\/oauth2\/passwordless\/login|\/oauth2\/passwordless\/token/
}

let vite;
// dev mode executes directly, SSR will be set for built bundles
// note we want to avoid obscuring this condition via a constant so that
// top level awaits are tree-shaked from the bundle and not just conditionally skipped
if (!import.meta.env?.SSR) {
    console.log('Starting Vite server...')
    const {createServer} = await import('vite')
    vite = await createServer({
        server: {middlewareMode: true},
        appType: 'custom',
        base,
    })
}

const {handler, app} = RemoteServerFactory.createHandler(options, (app) => {
    if (!import.meta.env?.SSR) {
        app.use(vite.middlewares)
    }

    app.get('/hello', (req, res) => {
        res.status(200).set({'Content-Type': 'text/plain'}).end('hello world')
    })

    // primary route
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl

        // dev mode will use vite middlewares
        if (!import.meta.env?.SSR) {
            try {
                let template = fs.readFileSync(
                    path.resolve(__dirname, 'index.html'),
                    'utf-8',
                )
                template = await vite.transformIndexHtml(url, template)
                const {render} = await vite.ssrLoadModule('/src/entry-server.tsx')
                // SSR render
                const appHtml = await render(url)

                const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

                res.status(200).set({'Content-Type': 'text/html'}).end(html)
            } catch (e) {
                vite.ssrFixStacktrace(e)
                next(e)
            }
        } else {
            res.status(200).set({'Content-Type': 'text/plain'}).end('hello running on MRT')
            next()
        }
    })
})

if (!import.meta.env?.SSR) {
    console.log(`Server listening on http://localhost:${port}`)
    app.listen(port)
}

// required by AWS Lambda
export const get = handler
