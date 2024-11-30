import {RemoteServerFactory} from '@salesforce/pwa-kit-runtime/ssr/server/build-remote-server.js'

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
    }
})