import "react-router";

// react-router express entry point
var BUNDLE_ID = process.env.BUNDLE_ID
// client assets built to client dir
var BUNDLE_PATH = `/mobify/bundle/${BUNDLE_ID}/client/`

//@ts-ignore
global._BUNDLE_PATH = BUNDLE_PATH || '/';

import { createRequestHandler } from "@react-router/express";

declare module "react-router" {
    interface AppLoadContext {
        VALUE_FROM_EXPRESS: string;
    }
}

export const reqHandler = createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
        return {
            VALUE_FROM_EXPRESS: "Hello from Express",
        };
    },
})
