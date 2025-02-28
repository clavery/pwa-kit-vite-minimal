import {
    type RouteConfig,
    index,
    prefix,
    route,
} from "@react-router/dev/routes"

export default [
    index("routes/home.tsx"),
    route("test", "routes/test.tsx"),

    ...prefix("products", [
        index("routes/products/index.tsx"),
        route(":pid", "routes/products/product.tsx"),
    ]),
] satisfies RouteConfig

