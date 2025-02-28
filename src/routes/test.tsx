import { useState } from "react"
import type { Route } from "./+types/test"
import DefaultLayout from "@/routes/_layout.tsx"

export function meta(_args: Route.MetaArgs) {
    return [{ title: "pwa-kit-vite-minimal test page" }]
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loader({ }: Route.LoaderArgs) {
    await sleep(1000)
    return { foo: "bar"}
}

export async function clientLoader({
  //serverLoader,
}: Route.ClientLoaderArgs) {
  return { "foo":"baz", "client": "yes" };
}

export default function Test({loaderData}: Route.ComponentProps) {
    const [count, _setCount] = useState(0)

    return (
        <DefaultLayout>
            <div className="max-w-800 mx-auto my-0 text-center">
                <h1 className="text-4xl font-bold mb-1">
                   TEST PAGE 2 {count} {loaderData.foo}
                </h1>
            </div>
        </DefaultLayout>
    )
}
