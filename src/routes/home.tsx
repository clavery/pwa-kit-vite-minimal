import type {Route} from "./+types/home";
import {useState} from "react";
import NewsletterPopup from "@/components/NewsletterPopup";
import {Button} from "@/components/ui/button.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {Link} from "react-router";

export function meta(_args: Route.MetaArgs) {
    return [
        {title: "pwa-kit-vite-minimal poc"}
    ];
}

export default function Home() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="max-w-800 mx-auto my-0 text-center">
                <h1 className="text-4xl font-bold mb-1">
                    pwa-kit-runtime-with-vite-tailwind-shadcn
                </h1>
                <NewsletterPopup/>

                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
                <p className="m-2">
                    Bacon ipsum dolor amet chicken turducken rump leberkas beef alcatra buffalo andouille jerky chuck
                    chuck
                </p>
                <p>
                    <Link to={"test"}>Go to test page</Link>
                </p>
            </div>
            <Toaster />
        </>
    )
}