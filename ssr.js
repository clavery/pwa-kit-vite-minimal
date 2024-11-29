// This is a javascript file as it's run directly by node
// You could use typescript instead with something like ts-node, etc
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {RemoteServerFactory} from '@salesforce/pwa-kit-runtime/ssr/server/build-remote-server.js'
import {createRequestHandler} from "@react-router/express";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = !!import.meta.env?.SSR
const isRemote = Object.prototype.hasOwnProperty.call(process.env, 'AWS_LAMBDA_FUNCTION_NAME')
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const SERVER_BUNDLE_BUILD_PATH = "./server/index.js";

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
    if (!import.meta.env?.SSR) { // dev
        app.use('*', async (req, res, next) => {
            try {
                const source = await vite.ssrLoadModule("./server/app.ts");
                return await source.reqHandler(req, res, next);
            } catch (error) {
                console.log(error)
                if (typeof error === "object" && error instanceof Error) {
                    vite.ssrFixStacktrace(error);
                }
                next(error);
            }
        })
    } else { // production
        app.use('*', async (req, res, next) => {
            const _build = await import(SERVER_BUNDLE_BUILD_PATH)
            console.log(BUNDLE_PATH)
            // easier to just replace the path in the string than to try to manipulate the object
            const newAssets = JSON.parse(JSON.stringify(_build.assets).replace(/"\/assets\//g, `"${BUNDLE_PATH}assets\/`))
            const build = Object.assign({}, _build, {
                publicPath: BUNDLE_PATH,
                assets: newAssets
            })
            const requestHandler = createRequestHandler({
                build
            })
            return await requestHandler(req, res, next)
        })
    }
})

if (!import.meta.env?.SSR) {
    console.log(`Server listening on http://localhost:${port}`)
    app.listen(port)
}

// required by AWS Lambda
export const get = handler
