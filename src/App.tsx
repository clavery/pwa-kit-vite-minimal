import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Bacon ipsum dolor amet chicken turducken rump leberkas beef alcatra buffalo andouille jerky chuck.
        </p>
      </div>
    </>
  )
}

export default App
