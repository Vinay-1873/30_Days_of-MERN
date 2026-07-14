import { useState } from 'react'
import LiveChat from './components/LiveChat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LiveChat />
    </>
  )
}

export default App
