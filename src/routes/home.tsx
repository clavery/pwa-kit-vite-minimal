import type {Route} from "./+types/home";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import DefaultLayout from "./_layout.tsx";

export function meta(_args: Route.MetaArgs) {
    return [
        {title: "pwa-kit-vite-minimal poc"}
    ];
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
                    Bacon ipsum dolor amet chicken turducken rump leberkas beef alcatra buffalo andouille jerky chuck
                    chuck4
                </p>
            </div>
        </DefaultLayout>
    )
}
