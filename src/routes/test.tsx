import type {Route} from "./+types/home";

export function meta(_args: Route.MetaArgs) {
    return [
        {title: "pwa-kit-vite-minimal test page"}
    ];
}

export default function Test() {
    return (
        <>
            <div className="max-w-800 mx-auto my-0 text-center">
                <h1 className="text-4xl font-bold mb-1">
                    TEST PAGE
                </h1>
            </div>
        </>
    )
}