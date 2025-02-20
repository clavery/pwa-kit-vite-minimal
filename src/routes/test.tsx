import { useState } from "react"
import type { Route } from "./+types/home"
import DefaultLayout from "@/routes/_layout.tsx"

export function meta(_args: Route.MetaArgs) {
    return [{ title: "pwa-kit-vite-minimal test page" }]
}

export default function Test() {
    const [count, setCount] = useState(0)
    return (
        <DefaultLayout>
            <div className="max-w-800 mx-auto my-0 text-center">
                <h1 className="text-4xl font-bold mb-1">
                    TEST PAGE 2 {count}
                </h1>
            </div>
        </DefaultLayout>
    )
}
