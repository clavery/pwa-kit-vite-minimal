// entry point for the client bundle

import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'

hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <StrictMode>
        <App />
    </StrictMode>,
)