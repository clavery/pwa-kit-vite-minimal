import {RemoteServerFactory} from '@salesforce/pwa-kit-runtime/ssr/server/build-remote-server.js'
import serverlessExpress from '@codegenie/serverless-express'
import {processLambdaResponse} from '@salesforce/pwa-kit-runtime/utils/ssr-server.js'

/**
 * Override some behavior of the pwa-kit-runtime RemoteServerFactory
 * while in development mode
 */
export const ServerFactory = Object.assign({}, RemoteServerFactory, {
    _setRequestId: function(app) {
        if (!import.meta.env?.SSR) {
            app.use((req, res, next) => {
                // shim in a request id
                const correlationId = (new Date()).getTime().toString();
                req.headers['x-correlation-id'] = correlationId
                res.locals = res.locals || {};
                res.locals.requestId = correlationId;
                next()
            })
        } else {
            return RemoteServerFactory._setRequestId.call(this, app)
        }
    },

    /**
     * Override _createHandler to use @codegenie/serverless-express instead of deprecated aws-serverless-express
     * @private
     */
    _createHandler(app, options) {
        // Lambda container reuse flag
        let lambdaContainerReused = false

        // Binary mime types for serverless-express
        const binaryMimeTypes = ['application/*', 'audio/*', 'font/*', 'image/*', 'video/*']

        // Configure serverless-express with the app and binary mime types
        const serverlessExpressInstance = serverlessExpress({ app, binaryMimeTypes })

        const handler = (event, context, callback) => {
            // Encode non ASCII request headers if needed
            if (options?.encodeNonAsciiHttpHeaders) {
                Object.keys(event.headers).forEach((key) => {
                    const headerValue = event.headers[key]
                    if (headerValue && !/^[\x20-\x7E]*$/.test(headerValue)) {
                        event.headers[key] = encodeURIComponent(headerValue)
                        const encodedHeadersKey = 'x-encoded-headers'
                        if (event.headers[encodedHeadersKey]) {
                            event.headers[encodedHeadersKey] = `${event.headers[encodedHeadersKey]},${key}`
                        } else {
                            event.headers[encodedHeadersKey] = key
                        }
                    }
                })
            }

            // Don't wait for empty event loop
            context.callbackWaitsForEmptyEventLoop = false

            // Handle container reuse metrics
            if (lambdaContainerReused) {
                const forceGarbageCollection = process.env.FORCE_GC
                if (forceGarbageCollection && forceGarbageCollection.toLowerCase() === 'true') {
                    app._collectGarbage()
                }
                app.sendMetric('LambdaReused')
            } else {
                lambdaContainerReused = true
                app.sendMetric('LambdaCreated')
            }

            // Process the request through serverless-express
            const processRequest = async () => {
                try {
                    // Wait for all pending metrics and response caching to complete
                    await app._requestMonitor._waitForResponses()
                    await app.metrics.flush()

                    // Process the Lambda event through serverless-express
                    const response = await serverlessExpressInstance(event, context)

                    // Process and return the Lambda response
                    callback(null, processLambdaResponse(response, event))
                } catch (err) {
                    callback(err)
                }
            }

            // Execute the async processing
            processRequest()
        }

        return { handler, app }
    }
})
