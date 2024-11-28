import {useState} from 'react'
import './App.css'
import {Helmet} from "react-helmet";


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Helmet>
                <title>pwa-kit-vite-minimal poc</title>
            </Helmet>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <Helmet>
                    <script>
                        console.log('hello from the top of the page')
                    </script>
                </Helmet>
                <p>
                    Bacon ipsum dolor amet chicken turducken rump leberkas beef alcatra buffalo andouille jerky chuck
                    chuck
                </p>
            </div>
        </>
    )
}

export default App
