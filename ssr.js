import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {RemoteServerFactory} from '@salesforce/pwa-kit-runtime/ssr/server/build-remote-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production' ||
    Object.prototype.hasOwnProperty.call(process.env, 'AWS_LAMBDA_FUNCTION_NAME')
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
    port: 3000,

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
if (!isProduction) {
    const {createServer} = await import('vite')
    vite = await createServer({
        server: {middlewareMode: true},
        appType: 'custom',
        base,
    })
}

const {handler, app} = RemoteServerFactory.createHandler(options, (app) => {
    if (!isProduction) {
        app.use(vite.middlewares)
    }

    // primary route
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl

        if (!isProduction) {
            try {
                // 1. Read index.html
                let template = fs.readFileSync(
                    path.resolve(__dirname, 'index.html'),
                    'utf-8',
                )

                // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
                //    and also applies HTML transforms from Vite plugins, e.g. global
                //    preambles from @vitejs/plugin-react
                template = await vite.transformIndexHtml(url, template)

                // 3. Load the server entry. ssrLoadModule automatically transforms
                //    ESM source code to be usable in Node.js! There is no bundling
                //    required, and provides efficient invalidation similar to HMR.
                const {render} = await vite.ssrLoadModule('/src/entry-server.jsx')

                // 4. render the app HTML. This assumes entry-server.js's exported
                //     `render` function calls appropriate framework SSR APIs,
                //    e.g. ReactDOMServer.renderToString()
                const appHtml = await render(url)

                // 5. Inject the app-rendered HTML into the template.
                const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

                // 6. Send the rendered HTML back.
                res.status(200).set({'Content-Type': 'text/html'}).end(html)
            } catch (e) {
                // If an error is caught, let Vite fix the stack trace so it maps back
                // to your actual source code.
                vite.ssrFixStacktrace(e)
                next(e)
            }
        } else {
            res.status(200).set({'Content-Type': 'text/plain'}).end('hello running on MRT')
            next()
        }
    })
})

if (!isProduction) {
    console.log('Server listening on http://localhost:5173')
    app.listen(5173)
}

// required by AWS Lambda
export const get = handler
