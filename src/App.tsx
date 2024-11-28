import {useState} from 'react'
import './App.css'
import {Helmet} from "react-helmet";
import NewsletterPopup from "@/Dialog.tsx";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/toaster.tsx";


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Helmet>
                <title>pwa-kit-vite-minimal poc</title>
            </Helmet>
            <div className="max-w-800 mx-auto my-0 text-center">
                <h1 className="text-4xl font-bold mb-1">
                    pwa-kit-runtime-with-vite-tailwind-shadcn
                </h1>
                <Helmet>
                    <script>
                        console.log('hello from the top of the page')
                    </script>
                </Helmet>
                <NewsletterPopup/>

                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
                <p className="m-2">
                    Bacon ipsum dolor amet chicken turducken rump leberkas beef alcatra buffalo andouille jerky chuck
                    chuck
                </p>
                <Toaster />
            </div>
        </>
    )
}

export default App
