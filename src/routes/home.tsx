import type { Route } from "./+types/home"
import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import DefaultLayout from "./_layout.tsx"
import exampleImage from "@/assets/example.jpg"

export function meta(_args: Route.MetaArgs) {
    return [{ title: "pwa-kit-vite-minimal poc" }]
}

export default function Home() {
    const [count, setCount] = useState(0)

    return (
        <DefaultLayout>
            <div className="max-w-800 mx-auto my-0 text-center">
                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
                <p className="m-2">
                    Bacon ipsum dolor amet chicken turducken rump leberkas beef
                    alcatra buffalo andouille jerky chuck chuck4
                </p>

                <img
                    src={exampleImage}
                    alt="Example image"
                    className="mx-auto my-4 w-24 h-24 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400"
                />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 animate-spin"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                </svg>
            </div>
        </DefaultLayout>
    )
}
