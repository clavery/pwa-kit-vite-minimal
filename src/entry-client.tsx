// entry point for the react client bundle

import {hydrateRoot} from 'react-dom/client'
import App from './App'

hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <App/>
)