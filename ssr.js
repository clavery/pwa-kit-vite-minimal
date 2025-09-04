// This is a javascript file as it's run directly by node
// You could use typescript instead with something like ts-node, etc
import { ServerFactory } from "./server/server-factory.js"
import { createRequestHandler } from "@react-router/express"
import { getCurrentInvoke } from "@codegenie/serverless-express"

const port = process.env.PORT || 5173
const base = process.env.BASE || "/"
const SERVER_BUNDLE_BUILD_PATH = "./server/index.js"

var BUNDLE_ID = process.env.BUNDLE_ID
// client assets built to client dir
var BUNDLE_PATH = `/mobify/bundle/${BUNDLE_ID}/client/`

global._BUNDLE_PATH = BUNDLE_PATH || '/';

const options = {
    // The contents of the config file for the current environment
    mobify: {},
    localAllowCookies: true,
}

// this is hacky to avoid a top level await
let vite
let vitePromise

if (!import.meta.env?.SSR) {
    console.log("Starting Vite server...")
    vitePromise = import("vite").then(({ createServer }) =>
        createServer({
            server: { middlewareMode: true },
            appType: "custom",
            base,
        })
    )
}

const getVite = async () => {
    if (!vite && vitePromise) {
        vite = await vitePromise
    }
    return vite
}

const { handler, app } = ServerFactory.createHandler(options, (app) => {
    if (!import.meta.env?.SSR) {
        app.use(async (req, res, next) => {
            const viteInstance = await getVite()
            viteInstance.middlewares(req, res, next)
        })
    }

    app.get("/robots.txt", (req, res) => {
        res.status(404).end()
    })
    app.get("/worker.js", (req, res) => {
        res.status(404).end()
    })
    app.get("/favicon.ico", (req, res) => {
        res.status(404).end()
    })

    app.get("/hello", (req, res) => {
        res.status(200).set({ "Content-Type": "text/plain" }).end("hello world")
    })

    // primary route
    if (!import.meta.env?.SSR) {
        // dev
        app.use("*", async (req, res, next) => {
            try {
                const viteInstance = await getVite()
                const source = await vite.ssrLoadModule("./server/app.ts")
                return await source.reqHandler(req, res, next)
            } catch (error) {
                console.log(error)
                if (typeof error === "object" && error instanceof Error) {
                    vite.ssrFixStacktrace(error)
                }
                next(error)
            }
        })
    } else {
        // production
        app.use("*", async (req, res, next) => {
            // some debugging output
            const { event, context } = getCurrentInvoke()
            console.log("serverless event", event)
            console.log("serverless context", context)

            const _build = await import(SERVER_BUNDLE_BUILD_PATH)
            // easier to just replace the path in the string than to try to manipulate the object
            const newAssets = JSON.parse(
                JSON.stringify(_build.assets).replace(
                    /"\/assets\//g,
                    `"${BUNDLE_PATH}assets\/`
                )
            )

            const build = Object.assign({}, _build, {
                publicPath: BUNDLE_PATH,
                assets: newAssets,
            })
            const requestHandler = createRequestHandler({
                build,
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
