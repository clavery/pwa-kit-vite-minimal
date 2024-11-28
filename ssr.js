// This is a javascript file as it's run directly by node
// You could use typescript instead with something like ts-node, etc
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {RemoteServerFactory} from '@salesforce/pwa-kit-runtime/ssr/server/build-remote-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = !!import.meta.env?.SSR
const isRemote = Object.prototype.hasOwnProperty.call(process.env, 'AWS_LAMBDA_FUNCTION_NAME')
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// load client HTML from build dir in production at boot up
const TEMPLATE_HTML = isProduction
    ? fs.readFileSync(path.resolve(__dirname, './client/index.html'), 'utf-8')
    : ''

const options = {
    // The contents of the config file for the current environment
    mobify: {},
    localAllowCookies: true
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

var BUNDLE_ID = process.env.BUNDLE_ID
// client assets built to client dir
var BUNDLE_PATH = `/mobify/bundle/${BUNDLE_ID}/client/`

const {handler, app} = RemoteServerFactory.createHandler(options, (app) => {
    if (!import.meta.env?.SSR) {
        app.use(vite.middlewares)
    }

    app.get('/robots.txt', (req, res) => {
        res.status(404).end()
    })
    app.get('/worker.js', (req, res) => {
        res.status(404).end()
    })
    app.get('/favicon.ico', (req, res) => {
        res.status(404).end()
    })

    app.get('/hello', (req, res) => {
        res.status(200).set({'Content-Type': 'text/plain'}).end('hello world')
    })

    // primary route
    app.use('*', async (req, res) => {
        const url = req.originalUrl

        let template
        let render
        try {
            // dev mode will use vite API
            if (!import.meta.env?.SSR) {
                let _template = fs.readFileSync(
                    path.resolve(__dirname, 'index.html'),
                    'utf-8',
                )
                template = await vite.transformIndexHtml(url, _template)
                template = template.replace(/\$baseUrl/g, "/")
                render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
            } else {
                template = TEMPLATE_HTML
                // replace the (vite)templated assets with the bundle path and also update the global for renderBuiltUrl
                template = template.replace(/\/assets/g, BUNDLE_PATH + 'assets')
                template = template.replace(/\$baseUrl/g, BUNDLE_PATH)
                render = (await import('./src/entry-server.tsx')).render
            }
            let status = 200;
            let rendered;
            try {
                /** @type {{html: string, head: HelmetData}} */
                rendered = await render(url)
            } catch (e) {
                // if ssr rendering fails (error boundaries do not work in SSR)
                // try to still load client shell but set 500 status
                // client errors will be caught by the error boundary
                status = 500
                console.error(e)
                rendered = {
                    html: '',
                    head: {
                    },
                }
            }

            var html = template
                .replace(`$appHtml`, rendered.html ?? '')
            // interpolate the helmet tags if present
            Object.keys(rendered.head).forEach((key) => {
                html = html.replace(`$HELMET.${key}`, rendered.head[key].toString())
            })
            // remove any remaining $HELMET tags
            html = html.replace(/\$HELMET\.\w+/g, '')

            res.status(status).set({'Content-Type': 'text/html'}).send(html)
        } catch (e) {
            // any major error should not render the page
            vite?.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })
})

if (!import.meta.env?.SSR) {
    console.log(`Server listening on http://localhost:${port}`)
    app.listen(port)
}

// required by AWS Lambda
export const get = handler
