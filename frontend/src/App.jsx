import { useState } from 'react'
import './App.css'
import Title from './components/Title'
import Game from './components/Game'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Title />
      <Game />
    </>
  )
}

export default App
